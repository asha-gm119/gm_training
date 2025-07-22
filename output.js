const express=require('express');

const app=express();

const products = [
  { id: "1", name: "Laptop", price: 1200 },
  { id: "2", name: "Phone", price: 800 },
  { id: "3", name: "Headphones", price: 150 },
];

app.get('/product/:id',(req,res)=>{
    const productID=req.params.id;
    const prod=products.find((product)=>product.id==productID);
    console.log("Product:",prod);
    if(prod)
    {
        res.status(200).json(prod.name)
    }else{
        res.status(404).json({"message":"Product not found"})
    }
    // res.send("Hellllllloooooo");
    // res.status(200).send('Successfull api request')
})
app.get("/getAllProducts",(req,res)=>{
    res.status(200).json(products);
})

app.listen(4000,()=>{
    console.log("Print data");
})

app.get('/getProducts',(req,res)=>{
    res.status(200).json({"message":products});
})

app.post('/addProduct',(req,res)=>{
    res.status(201).json({"message":"Product added successfully"});
})

app.put('/updateProduct/:id',(req,res)=>{
    res.status(200).json({"message":"Product updated successfully"});
})

app.delete('/deleteProduct/:id',(req,res)=>{
    res.status(200).json({"message":"Product deleted Successfully"});
})