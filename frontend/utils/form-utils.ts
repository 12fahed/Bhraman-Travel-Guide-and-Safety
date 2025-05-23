export const validateEmail = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export const validatePassword = (password: string) => {
  return password.length >= 8
}

export const validatePhone = (phone: string) => {
  return /^\+?[\d\s-]{10,}$/.test(phone)
}

export const getPasswordStrength = (password: string) => {
  const hasUpperCase = /[A-Z]/.test(password)
  const hasLowerCase = /[a-z]/.test(password)
  const hasNumbers = /\d/.test(password)
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)

  const strength = [hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChar].filter(Boolean).length

  return {
    score: strength,
    label: ["Very Weak", "Weak", "Fair", "Good", "Strong"][strength] || "Very Weak",
  }
}

