const bodyParser = require('body-parser');
const app = require('express')();
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const {users} = require('./models');

app.use(bodyParser.json());

app.use(cookieParser('JAYKAKADIYA'));

app.post('/login', async (req, res) => {
    console.log(req.body);
    const bcrypt = require('bcrypt');
    let variable = await users.findOne({
        where : {
            username: req.body.username,
            isActive: 1
        }
    });
    if (variable === null) {
        return res.status(401).send('Username or password is incorrect');
    }
    if (! bcrypt.compareSync(req.body.password, variable.password)) {
        return res.status(401).send('Username or password is incorrect');
    }
    const token = jwt.sign({uid: variable.uuid}, 'JAY');
    res.cookie('token', token,
    { signed: true, httpOnly: true, path: '/', secure: true,
        maxAge: Math.round(Date.now()/1000) + (86400*90)
    });
    return res.send({token: token});
});

app.post('/register', (req, res) => {
    users.create(req.body);
    return res.status(201).send("User created");
})

app.listen(2525, () => console.log('run.......'));