import streamlit as st

st.set_page_config(
    page_title="BHRAMAN",
    page_icon="🌍",
    initial_sidebar_state="collapsed",
    layout="wide"
)

opening_screen = """
<html>
<head>
    <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap" rel="stylesheet">
    <style>
        body, html {
            margin: 0;
            padding: 0;
            overflow: hidden;
        }
        .container {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: linear-gradient(-45deg, #FF8C00, #FFA500, #FFD700, #FF6B00);
            background-size: 400% 400%;
            animation: gradientBG 8s ease infinite;
            display: flex;
            justify-content: center;
            align-items: center;
            overflow: hidden;
            z-index: 9999;
        }
        
        @keyframes gradientBG {
            0% { background-position: 0% 50% }
            50% { background-position: 100% 50% }
            100% { background-position: 0% 50% }
        }

        .text-container {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100%;
            width: 100%;
        }

        .letter {
            font-family: 'Bebas Neue', sans-serif;
            font-size: 15vmin;
            color: rgba(255, 255, 255, 0.95);
            text-shadow: 0 0 20px rgba(255, 165, 0, 0.5);
            opacity: 0;
            transform-origin: center center;
            animation: letterFloat 1.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
            position: relative;
            display: inline-block;
            margin: 0 0.05em;
        }

        @keyframes letterFloat {
            0% {
                opacity: 0;
                transform: translateY(-100vh) scale(0.2) rotate(180deg);
            }
            60% {
                opacity: 1;
                transform: translateY(20px) scale(1.2) rotate(-10deg);
            }
            80% {
                transform: translateY(-10px) scale(0.95) rotate(5deg);
            }
            100% {
                opacity: 1;
                transform: translateY(0) scale(1) rotate(0deg);
            }
        }

        .letter::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
            transform: translateX(-100%);
            animation: shimmer 2s infinite;
        }

        @keyframes shimmer {
            100% {
                transform: translateX(100%);
            }
        }

        .particles {
            position: absolute;
            width: 100%;
            height: 100%;
            z-index: -1;
        }

        .particle {
            position: absolute;
            background: rgba(255, 255, 255, 0.6);
            border-radius: 50%;
            pointer-events: none;
            animation: particleMove 4s infinite ease-in-out;
        }

        @keyframes particleMove {
            0%, 100% {
                transform: translate(0, 0) rotate(0deg) scale(1);
            }
            25% {
                transform: translate(var(--tx), var(--ty)) rotate(90deg) scale(0.5);
            }
            50% {
                transform: translate(calc(var(--tx) * -1), calc(var(--ty) * -1)) rotate(180deg) scale(1.5);
            }
            75% {
                transform: translate(calc(var(--tx) * -0.5), calc(var(--ty) * 0.5)) rotate(270deg) scale(0.75);
            }
        }

        /* Hide Streamlit Components */
        .stApp > header { display: none !important; }
        #MainMenu { display: none !important; }
        footer { display: none !important; }
    </style>
</head>
<body>
    <div class="container">
        <div class="particles" id="particles"></div>
        <div class="text-container">
            <div class="letter" style="animation-delay: 0.1s;">B</div>
            <div class="letter" style="animation-delay: 0.3s;">H</div>
            <div class="letter" style="animation-delay: 0.5s;">R</div>
            <div class="letter" style="animation-delay: 0.7s;">A</div>
            <div class="letter" style="animation-delay: 0.9s;">M</div>
            <div class="letter" style="animation-delay: 1.1s;">A</div>
            <div class="letter" style="animation-delay: 1.3s;">N</div>
        </div>
    </div>

    <script>
        function createParticles() {
            const particlesContainer = document.getElementById('particles');
            const particleCount = 50;

            for (let i = 0; i < particleCount; i++) {
                const particle = document.createElement('div');
                particle.className = 'particle';
                
                const size = Math.random() * 15 + 5;
                particle.style.width = size + 'px';
                particle.style.height = size + 'px';
                
                particle.style.left = Math.random() * 100 + 'vw';
                particle.style.top = Math.random() * 100 + 'vh';
                
                const tx = (Math.random() - 0.5) * 300;
                const ty = (Math.random() - 0.5) * 300;
                particle.style.setProperty('--tx', tx + 'px');
                particle.style.setProperty('--ty', ty + 'px');
                
                particle.style.animationDelay = Math.random() * 4 + 's';
                
                particlesContainer.appendChild(particle);
            }
        }

        createParticles();

        // Redirect after animation with a funky flash effect
        setTimeout(() => {
            const container = document.querySelector('.container');
            const letters = document.querySelectorAll('.letter');
            
            // Final animation for letters
            letters.forEach((letter, index) => {
                setTimeout(() => {
                    letter.style.transform = 'scale(2) rotate(360deg)';
                    letter.style.opacity = '0';
                    letter.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
                }, index * 100);
            });

            // Background flash effect
            container.style.transition = 'all 1s ease';
            container.style.filter = 'brightness(300%) contrast(200%)';
            
            setTimeout(() => {
                window.location.href = "/?page=main";
            }, 1000);
        }, 5000);
    </script>
</body>
</html>
"""

# Check if we're on the main page or opening screen
if "page" in st.experimental_get_query_params():
    # Main page content
    st.title("Welcome to BHRAMAN")
    st.write("This is the main page of your application.")
else:
    # Show opening screen
    st.markdown(opening_screen, unsafe_allow_html=True)