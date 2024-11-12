# Gift App with Crypto Pay

Tech stack:

- React
- Wouter
- framer-motion
- react-i18next
- @tanstack/react-query
- @lottiefiles/dotlottie-web (+ custom code around it for smooth transitions, etc. Note: `dotlottie` runs lotties in OffscreenCanvas in a web-worker, can spawn thousands without any lags)

# Installl

Like any other React project it's just `npm install`.
One thing you need to do is to create `.env` file and add URL to backend instance though.
That's about it

```
VITE_API_URL="http://localhost:3000"
```

# Notes

Given time constrains some code is not that nice, there are many things I'd like to refactor. But oh well, can't spend more time on this.
