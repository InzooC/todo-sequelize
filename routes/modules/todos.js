const express = require('express')
const router = express.Router()
const passport = require('passport')
const bcrypt = require('bcryptjs')
const db = require('../../models')
const { route } = require('./home')
const Todo = db.Todo
const User = db.User


//新增todo
router.get('/new', (req, res) => {
  return res.render('new')
})
router.post('/', (req, res) => {
  const name = req.body.name
  const UserId = req.user.id
  return Todo.create({ name, UserId }) //存入資料庫
    .then(() => res.redirect('/')) //完成新增之後，重新導回首頁
    .catch(error => console.log(error))
})
//刪除
router.delete('/:id', (req, res) => {
  const id = req.params.id
  return Todo.destroy({
    where: { id }
  })
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})
//查看詳細頁
router.get('/:id', (req, res) => {
  const id = req.params.id
  return Todo.findByPk(id)
    .then(todo => res.render('detail', { todo: todo.toJSON() }))
    .catch(error => console.log(error))
})
//編輯頁
router.get('/:id/edit', (req, res) => {
  const id = req.params.id
  return Todo.findByPk(id)
    .then(todo => res.render('edit', { todo: todo.toJSON() }))
    .catch(error => console.log(error))
})
router.put('/:id', (req, res) => {
  const id = req.params.id
  const { name, isDone } = req.body
  return Todo.findByPk(id)
    .then(todo => {
      todo.name = name
      todo.isDone = isDone === 'on'
      return todo.save()
    })
    .then(() => res.redirect(`/todos/${id}`))
    .catch(error => console.log(error))
})





module.exports = router