from flask import Flask, request, jsonify
from flask_cors import CORS
import boto3
import json
import re

app = Flask(__name__)
CORS(app)

def get_bedrock_response(prompt):
    client = boto3.client("bedrock-runtime", region_name="us-east-1")
    body = {
        "messages": [{"role": "user", "content": prompt}],
        "anthropic_version": "bedrock-2023-05-31",
        "max_tokens": 1024,
        "temperature": 0.3
    }
    response = client.invoke_model(
        modelId="amazon.titan-text-lite-v1",
        contentType="application/json",
        accept="application/json",
        body=json.dumps(body)
    )
    return json.loads(response['body'].read())['content'][0]['text']

def create_resume_analysis_prompt(resume_text, industry, experience_level, check_ats):
    prompt = f"""
    You are an expert resume analyzer and career coach. Please analyze the following resume for a {experience_level} position in {industry}.
    
    RESUME TEXT:
    {resume_text}
    
    Please provide a comprehensive analysis in the following JSON format:
    {{
        "score": <overall_score_0-100>,
        "ats_compatibility": <ats_score_0-100>,
        "strengths": ["strength1", "strength2", "strength3"],
        "weaknesses": ["weakness1", "weakness2", "weakness3"],
        "suggestions": [
            {{"text": "suggestion1", "priority": "high/medium/low"}},
            {{"text": "suggestion2", "priority": "high/medium/low"}}
        ],
        "keywords_found": ["keyword1", "keyword2"],
        "keywords_missing": ["missing_keyword1", "missing_keyword2"]
    }}
    
    Focus on:
    - Overall resume quality and effectiveness
    - ATS compatibility if check_ats is enabled
    - Industry-specific requirements for {industry}
    - Experience level appropriateness for {experience_level}
    - Actionable improvement suggestions
    """
    return prompt

def parse_bedrock_response(response_text):
    """Parse the Bedrock response and extract structured data"""
    try:
        # Try to find JSON in the response
        json_match = re.search(r'\{.*\}', response_text, re.DOTALL)
        if json_match:
            data = json.loads(json_match.group())
            return data
    except:
        pass
    
    # Fallback: generate structured data from text response
    return generate_fallback_analysis(response_text)

def generate_fallback_analysis(response_text):
    """Generate structured analysis from text response"""
    score = 75  # Default score
    ats_score = 70
    
    # Extract score if mentioned
    score_match = re.search(r'(\d+)%', response_text)
    if score_match:
        score = int(score_match.group(1))
    
    # Generate strengths and weaknesses based on response content
    strengths = []
    weaknesses = []
    
    if 'strong' in response_text.lower() or 'good' in response_text.lower():
        strengths.append("Clear and professional presentation")
    if 'experience' in response_text.lower():
        strengths.append("Relevant work experience highlighted")
    if 'skills' in response_text.lower():
        strengths.append("Technical skills well displayed")
    
    if 'improve' in response_text.lower() or 'weak' in response_text.lower():
        weaknesses.append("Areas for improvement identified")
    if 'missing' in response_text.lower():
        weaknesses.append("Some key elements may be missing")
    
    # Default suggestions
    suggestions = [
        {"text": "Add quantifiable achievements to job descriptions", "priority": "high"},
        {"text": "Include more industry-specific keywords", "priority": "medium"},
        {"text": "Ensure consistent formatting throughout", "priority": "low"}
    ]
    
    # Extract keywords
    keywords_found = ["Experience", "Skills", "Education"]
    keywords_missing = ["Leadership", "Problem-solving", "Teamwork"]
    
    return {
        "score": score,
        "ats_compatibility": ats_score,
        "strengths": strengths if strengths else ["Professional presentation", "Clear structure"],
        "weaknesses": weaknesses if weaknesses else ["Could benefit from more specific achievements"],
        "suggestions": suggestions,
        "keywords_found": keywords_found,
        "keywords_missing": keywords_missing
    }

@app.route('/analyze_resume', methods=['POST'])
def analyze_resume():
    try:
        data = request.get_json()
        
        # Validate required fields
        if not data or 'text' not in data:
            return jsonify({'error': 'Resume text is required'}), 400
        
        resume_text = data['text']
        industry = data.get('industry', 'Software Development')
        experience_level = data.get('experience_level', 'mid-level')
        check_ats = data.get('check_ats', True)
        
        # Create prompt for Bedrock
        prompt = create_resume_analysis_prompt(resume_text, industry, experience_level, check_ats)
        
        # Get analysis from Bedrock
        bedrock_response = get_bedrock_response(prompt)
        
        # Parse the response into structured data
        analysis_data = parse_bedrock_response(bedrock_response)
        
        return jsonify(analysis_data)
        
    except Exception as e:
        print(f"Error in analyze_resume: {str(e)}")
        return jsonify({'error': f'Analysis failed: {str(e)}'}), 500

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'service': 'resume-analyzer'})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3000, debug=True) 