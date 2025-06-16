const express =require('express')
const blogRouter = require('./posts/post.router')
const userRouter = require('./users/user.router')
const connectToDB = require('./config/connectToDB')
const authRouter = require('./auth/auth.router')
const isAuth = require('./middleware/isAuth.middleware')
const app = express()

app.use(express.json())
connectToDB()

app.use('/auth', authRouter)
app.use('/users', userRouter)
app.use('/blogs',isAuth, blogRouter)









app.listen(4000, ()=>{
    console.log('server is running on http://localhost:4000')
})