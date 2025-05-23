import google.generativeai as genai
import re

genai.configure(api_key='AIzaSyCaMUsyaIG6IK_AmVWLj6CEyNTUgpQQWR4')
# for m in genai.list_models():
    # if 'generateContent' in m.supported_generation_methods:
    # print(m.name)

model = genai.GenerativeModel('gemini-pro')

def generate_python_code(prompt):
    response = model.generate_content(
        f"Write a complete, executable Python function or script for: {prompt}.Call the function with the required argumentstoo that is include the driver code .Take input from user if needed "
        "Ensure the code is syntactically correct and includes necessary imports.",
        )
    code = re.sub(r'^```python\n|```$', '', response.text.strip(), flags=re.MULTILINE)
    print(code)
    return code

codw=generate_python_code("Calculate factorial of a user input number")
exec(codw)




def greet(name):
    return f"Hello, {name}!"

def execute_python_code(code_string: str):
    try:
        # Define a local namespace to allow access to the current functions
        local_namespace = globals().copy()
        exec(code_string, globals(), local_namespace)
    except Exception as e:
        print(f"Error while executing code: {e}")

# Example code to run
code_to_run = """
result = greet("Ritojnan")
print(result)
"""

execute_python_code(code_to_run)


# https://chatgpt.com/c/67a3a582-df64-8009-a988-c628c061d3f9