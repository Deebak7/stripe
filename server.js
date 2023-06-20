const express=require('express');
const app=express();
const fs=require('fs');

// const https=require('https');

if(process.env.NODE_ENV !== 'production'){
  require('dotenv').config()
}

const stripeSecretKey=process.env.STRIPE_SECRET_KEY
const stripePublicKey=process.env.STRIPE_PUBLIC_KEY
console.log('stripeSecretKey',stripeSecretKey);
console.log('stripePublicKey',stripePublicKey);
// const stripe=require('stripe').STRIPE_SECRET_KEY;
const stripe=require('stripe')(process.env.STRIPE_SECRET_KEY);

app.set('view engine','ejs');
app.use(express.static('public'));
app.use(express.json());

// app.use((req, res, next) => {
//   res.setHeader('Set-Cookie', 'name=value; SameSite=None; Secure');
//   next();
// });

app.get('/store',function(req,res){
  fs.readFile('items.json',function(error,data){
    if(error){
      res.status(500).end()
    }else{
      res.render('store.ejs',{
        stripePublicKey:stripePublicKey,
        items: JSON.parse(data)
      })
    }
  })
})

app.post('/purchase',function(req,res){
  fs.readFile('items.json',function(error,data){
    if(error){
      res.status(500).end()
    }else{
      console.log('purchase')
      const itemsJson=JSON.parse(data)
      console.log('itemsJson',itemsJson);
      const itemsArray=itemsJson.music.concat(itemsJson.merch)
      console.log('itemsArray',itemsArray);
      let total=0
      req.body.items.forEach(function(item){
        const itemJson=itemsArray.find(function(i){
          return i.id ==item.id
        })
        console.log('itemjson',itemJson);
        total=total+itemJson.price * item.quantity
        console.log('total',total);
      })
      stripe.charges.create({
        amount:total,
        source:req.body.stripeTokenId,
        // items:req.body.items,
        currency:'INR',
      }
      ).then(function(){
        console.log('charge successful')
        res.json({message:'successfully purchased items'})
      }).catch(function(err){
        console.log('charge fail',err)
        res.status(500).end()
      })
    }
  })
})


app.listen(3000);