#Codemate Apis
##authRouter
post /signup
post /login
post /logout

##profileRouter
get /profile/view
patch /profile/edit
patch /profile/password


status: ignore , interested, accepted , rejected
##connectionRequestRouter
post /request/send/interest/:userId
post /request/send/ignored/:userId
post /request/review/accepted/:requestId
post /request/review/rejected/:requestId

##userRouter
get /user/connections
get /user/requests/received
get /user/feed - gets you the profile of the user