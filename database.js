const express = require('express')
const app = express();
const mysql = require('mysql2');
const jwt = require('jsonwebtoken');
const cors = require('cors')
const secretKey = 'your_secret_key';
const port = 8000
app.use(express.urlencoded({ extended: false }))
app.use(express.json());
app.use(cors({
   
    methods: ['GET', 'POST','DELETE'],     
    allowedHeaders: ['Content-Type'], 
  }));
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'pass',
    database: 'log'
  });
  connection.connect(err => {
    if (err) {
      return console.error('error connecting: ' + err.stack);
    }
    console.log('connected as id ' + connection.threadId);
  });
  connection.query('SELECT * FROM invoice_details', (error, results, fields) => {
    if (error) throw error;
    console.log(results);
  });

app.get('/',(req,res)=>{
    res.send("hello");
})




//app post to comppany
app.post('/companys',(req,res)=>{
    console.log(req.body);
    const fetch = req.body;
    const { company_name, email, mobile_no, alternate_mobile, landline, address, website, logo, customer_prefix, invoice_prefix, gstin, panno, bank_name, bank_acc, bank_ifsc } = fetch;

    connection.query(` INSERT INTO company  (company_name, email, mobile_no, alternate_mobile, landline, address, website, logo, customer_prefix, invoice_prefix, gstin, panno, bank_name, bank_acc, bank_ifsc) VALUES ('${company_name}', '${email}', '${mobile_no}', '${alternate_mobile}', '${landline}', '${address}', '${website}', '${logo}', '${customer_prefix}', '${invoice_prefix}', '${gstin}', '${panno}', '${bank_name}', '${bank_acc}', '${bank_ifsc}')`,
 function (error, results, fields) {
        if (error) throw error;
        console.log('The solution is: ', results);
      });
    
;
    res.send("data Inserted");
})

//app update company
app.post('/company', (req, res) => {
    console.log(req.body);
    const fetch = req.body;
    const { company_name, email, mobile_no, alternate_mobile, landline, address, website, logo, customer_prefix, invoice_prefix, gstin, panno, bank_name, bank_acc, bank_ifsc } = fetch;

    connection.query(
        `UPDATE company 
         SET company_name = ?, email = ?, mobile_no = ?, alternate_mobile = ?, landline = ?, address = ?, website = ?, logo = ?, customer_prefix = ?, invoice_prefix = ?, gstin = ?, panno = ?, bank_name = ?, bank_acc = ?, bank_ifsc = ? 
         WHERE id = 1`,
        [company_name, email, mobile_no, alternate_mobile, landline, address, website, logo, customer_prefix, invoice_prefix, gstin, panno, bank_name, bank_acc, bank_ifsc],
        function (error, results, fields) {
            if (error) {
                console.error('Error executing query:', error);
                res.status(500).send('Internal Server Error');
                return;
            }
            console.log('Update successful:', results);
            res.send('Data Updated');
        }
    );
});


// app post to invoice

app.post('/invoices', (req, res) => {
    console.log(req.body);
    const fetch = req.body;
    console.log(fetch);
    const customer_id = fetch.customerName;
    console.log(customer_id)
    const invoice_id = fetch.invoiceIdcounter;
    const invoice_date = fetch.selectedDate;
    const invoice_amount = fetch.subtotal;
    const discount = fetch.discount;
    const actual_amount = fetch.total;
    const payment_mode = fetch.paymentOption;
    const pending_amount = fetch.pending_amt;
    // const { customer_id, invoice_id, invoice_date, invoice_amount, discount, actual_amount, pending_amount, payment_mode } = fetch;
    // console.log(customer_id,invoice_id);
    connection.query(`
        INSERT INTO invoice_details 
        (customer_id, invoice_id, invoice_date, invoice_amount, discount, actual_amount, pending_amount, payment_mode) 
        VALUES 
        ('${customer_id}', '${invoice_id}', '${invoice_date}', '${invoice_amount}', '${discount}', '${actual_amount}', '${pending_amount}', '${payment_mode}')
    `, 
    function (error, results, fields) {
        if (error) {
            console.error(error);
            res.status(500).send('Error inserting data');
            return;
        }
        console.log('The solution is: ', results);
        res.send("Data Inserted in invoices");
    });

});

app.post('/invoices/:id', (req, res) => {
  const customer_id = req.params.id;
  
  const fetch = req.body;

  const invoice_id = fetch.invoiceIdcounter;
  const invoice_date = fetch.selectedDate;
  const invoice_amount = fetch.subtotal;
  const discount = fetch.discount;
  const actual_amount = fetch.total;
  const payment_mode = fetch.paymentOption;
  const pending_amount = fetch.pending_amt;
  // const {  invoice_id, invoice_date, invoice_amount, discount, actual_amount, pending_amount, payment_mode } = fetch;
  //   console.log(customer_id,invoice_id);

  const updateQuery = `
      UPDATE invoice_details 
      SET 
          invoice_id = '${invoice_id}', 
          invoice_date = '${invoice_date}', 
          invoice_amount = '${invoice_amount}', 
          discount = '${discount}', 
          actual_amount = '${actual_amount}', 
          pending_amount = '${pending_amount}', 
          payment_mode = '${payment_mode}'
      WHERE 
          customer_id = '${customer_id}'
  `;

  connection.query(updateQuery, (error, results, fields) => {
      if (error) {
          console.error(error);
          res.status(500).send('Error updating data');
          return;
      }
      console.log('The solution is: ', results);
      res.send("Data Updated in invoices");
  });
});
// app psot for new user 
app.post('/users', (req, res) => {
    console.log(req.body);
    const fetch = req.body;
    const { fname, lname, email, mobile, reference, gstin } = fetch;

    connection.query(`
        INSERT INTO users 
        (fname, lname, email, password, mobile, user_role, reference, gstin) 
        VALUES 
        ('${fname}', '${lname}', '${email}', 'password', '${mobile}', 'Customer', '${reference}', '${gstin}')
    `, 
    function (error, results, fields) {
        if (error) {
            console.error(error);
            res.status(500).send('Error inserting data');
            return;
        }
        console.log('User inserted successfully:', results.insertId);
        res.send("User inserted successfully");
    });
});
app.post('/users/:id', (req, res) => {
  const userId = req.params.id;
  const fetch = req.body;
  const { fname, lname, email, mobile, reference, gstin } = fetch;

  // If ID is 0, insert a new user; otherwise, update the existing user
  if (userId === '0') {
      connection.query(`
          INSERT INTO users 
          (fname, lname, email, password, mobile, user_role, reference, gstin) 
          VALUES 
          ('${fname}', '${lname}', '${email}', 'password', '${mobile}', 'Customer', '${reference}', '${gstin}')
      `, 
      function (error, results, fields) {
          if (error) {
              console.error(error);
              res.status(500).send('Error inserting data');
              return;
          }
          console.log('User inserted successfully:', results.insertId);
          res.send("User inserted successfully");
      });
  } else {
      // Update existing user with the provided ID
      connection.query(`
          UPDATE users 
          SET 
              fname = '${fname}', 
              lname = '${lname}', 
              email = '${email}', 
              mobile = '${mobile}', 
              reference = '${reference}', 
              gstin = '${gstin}' 
          WHERE id = ${userId}
      `, 
      function (error, results, fields) {
          if (error) {
              console.error(error);
              res.status(500).send('Error updating data');
              return;
          }
          console.log('User updated successfully:', userId);
          res.send("User updated successfully");
      });
  }
});

// app get to users

app.get('/users',(req,res)=>{
    connection.query('SELECT * FROM users', (error, results, fields) => {
        if (error) res.status(500).json({ error: 'Internal Server Error' });
        console.log(results);
        res.json(results);
      });
})

app.get('/company',(req,res)=>{
    connection.query('SELECT * FROM company', (error, results, fields) => {
        if (error) res.status(500).json({ error: 'Internal Server Error' });
        console.log(results);
        res.json(results);
      });
})
app.get('/invoices',(req,res)=>{
    connection.query('SELECT * FROM invoice_details', (error, results, fields) => {
        if (error) res.status(500).json({ error: 'Internal Server Error' });
        console.log(results);
        res.json(results);
      });
});
app.delete('/users/:id', (req, res) => {
    const userId = req.params.id;
  
    const query = `DELETE FROM users WHERE id = '${userId}'`;
    connection.query(query, [userId], (error, results) => {
      if (error) {
        console.error('Error executing query:', error);
        res.status(500).send('Internal Server Error');
        return;
      } 
      if (results.affectedRows === 0) {
        res.status(404).send('Company not found');
      } else {
        res.send('Company deleted successfully');
      }
    });
  });
//   app.get('/invoices/:id',(req,res)=>{
//     const invoiceId = req.params.id;
//     connection.query(`SELECT * FROM invoice_details WHERE customer_id = '${invoiceId}'`, (error, results, fields) => {
//         if (error) res.status(500).json({ error: 'Internal Server Error' });
//         console.log(results);
//         res.json(results);
//       });
// });

app.get('/invoices/:customerId', (req, res) => {
  const customerId = req.params.customerId;

  connection.query(`
      SELECT * 
      FROM invoice_details 
      WHERE customer_id = ${customerId} 
      ORDER BY updated_at DESC 
      LIMIT 1
  `, 
  function (error, results, fields) {
      if (error) {
          console.error(error);
          res.json([{ pending_amount: '0' }]); // Return default value if there is an error
          return;
      }
      
      if (results.length === 0) {
          // No invoices found for the given customer ID
          res.json([{ pending_amount: '0' }]); // Return default value
          return;
      }

      // Invoices found, return the fetched invoice
      console.log('Latest invoice fetched successfully:', results);
      res.json(results);
  });
});



app.post('/admin', (req, res) => {
  console.log(req.body);
  const { email, password, role } = req.body;

  connection.query(
      `INSERT INTO admin (email, password, role) VALUES (?, ?, ?)`,
      [email, password, role],
      function (error, results, fields) {
          if (error) {
              console.error('Error inserting data into admin table:', error);
              res.status(500).send('Internal Server Error');
              return;
          }
          console.log('Data inserted into admin table:', results);
          res.send('Data inserted into admin table');
      }
  );
});
app.get('/admin',(req,res)=>{
  connection.query('SELECT * FROM admin', (error, results, fields) => {
    if (error) throw error;
    console.log(results);
    res.json(results)
  });
})
app.get('/users/:id', (req, res) => {
  const userId = req.params.id;

  // SQL query to fetch user data by ID using parameterized queries
  connection.query('SELECT * FROM users WHERE id = ?', [userId], (error, results, fields) => {
    if (error) {
      console.error('Error executing query:', error);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    if (results.length === 0) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    console.log(results);
    res.json(results);
  });
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  console.log(email,password);

  // Replace with your user validation logic
  if (email === 'admin@gmail.com' && password === 'password') {
    const token = jwt.sign({ email }, secretKey, { expiresIn: 60 });
    res.json({ token:token,auth:true });
    console.log(token)
  } else {
    res.json({ auth:false });
  }
});
app.post('/validate',(req,res)=>{
    console.log(req)
    const  reqToken= req.body.token;
    console.log(reqToken)
    jwt.verify(reqToken,secretKey,(err,decode)=>{
        if(err){
            res.json({auth:false});
            return;
        }
        res.json({auth:true})
    })
})
app.listen(port,()=>{
    console.log(`Port Litsening at ${port}`)
});
