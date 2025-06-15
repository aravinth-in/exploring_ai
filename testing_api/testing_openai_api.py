import openai

client = openai.OpenAI(api_key="YOUR_OPENAI")

response = client.chat.completions.create(
    model="gpt-3.5-turbo",
    messages=[
        {"role": "user", "content": "Explain the role of blockchain in modern finance."},
    ]
)

print(response.choices[0].message.content)