const mongoose = require('mongoose')

const { MONGO_URL_DEV } = require('../consts')
const Subject = require('../models/subject')
const User = require('../models/user')
// const resolver = require('../resolvers')
const { Mutation } = require('../resolvers')

describe('subject resolver', () => {
  beforeAll(async () => {
    await mongoose.connect(MONGO_URL_DEV)
    // clear the database
    await Subject.removeSubjects()
  })

  beforeEach(async () => {
    // const userInstance = new User(userData)
    // await userInstance.save()
    // const postInstance = new Post(postData)
    // await postInstance.save()
  })

  afterEach(async () => {
    await Subject.removeSubjects()
    await User.removeUsers()
  })

  afterAll(async done => {
    await mongoose.disconnect(done)
  })

  it('should create a subject', () => {
    const username = 'User2'
    const email = 'user2@user.com'
    const password = 'test2'

    const message = 'some message2'
    const title = 'some title2'

    return Mutation.createUser({}, { username, email, password }).then(user => {
      return Mutation.login({}, { username, password }).then(loginResult => {
        const { token } = loginResult

        return Mutation.createSubject({}, { token, message, title }).then(
          subject => {
            expect(subject.message).toBe(message)
            expect(subject.title).toBe(title)
            expect(subject.createdAt).toBeDefined()
            expect(subject.author).toBeDefined()
          }
        )
      })
    })
  })

  it('should return an error given an invalid token', () => {
    expect.assertions(1)
    const username = 'User2'
    const email = 'user2@user.com'
    const password = 'test2'

    const message = 'some message2'
    const title = 'some title2'

    const cheekyToken =
      'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1MjIzNDM1NjQsImV4cCI6MTUyMjQwODM2NH0.IHfxZBHvrwdETakAqbqBncg-rcvbOwRCG_zk2KFfFDunzki77aAReYHVqFTAVSwZ_C_YmlpIyUE8YXm2cIWViKeCPWuaLNd_G6yBZ9qwrBBtksFCDXWmUdLc4tJ92NzaIqwjVZtsfBRUleuWJu1MtIEIPO2gPIGA_pAvyd5zBY8fcdva4DgjBKwHKtn-2MuTwK9r_UgVE20DgLHu92sjv-qVlT6Op8hyTT5tGZjywVmlL23i7r_R7z6nBAzz1hYgVh9L7ndxNJagbOBftHzQe8mDEy0Mab9fVV8Gmr5-Il28ZTw4eCHct9Gd3LbFjuukb1kMCfkkISTUKxPmqwmAXw'

    return Mutation.createUser({}, { username, email, password }).then(user => {
      return Mutation.login({}, { username, password }).then(loginResult => {
        return Mutation.createSubject(
          {},
          { token: cheekyToken, message, title }
        ).catch(response => {
          expect(response).toMatchSnapshot()
        })
      })
    })
  })
})
