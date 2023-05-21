const express = require("express");
const cors = require("cors");
const data = require("./db/db.json");
const fs = require('fs')
const path = require('path');


const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => res.status(200).json({ msg: "server running" }));

app.get("/api", (req, res) => res.status(200).json(data));
app.get("/api/:id", (req, res) => {
  const filterData = data.find((ele) => ele.id === Number(req.params.id));
  if (filterData !== undefined) {
    res.status(200).json(filterData);
  } else {
    res.status(404).json({ msg: `can not find any data with{req.params.id}` });
  }
});

app.post('/api', (req,res)=>{
    const body = {...req.body,id: data.length+1}
    data.push(body)
    fs.writeFileSync(path.join(__dirname,"db/db.json"),JSON.stringify(data));
    res.status(200).json({msg:'created', data: body});
})
app.put('/api/:id', (req,res)=>{
    const filterData = data.find((ele) => ele.id === Number(req.params.id));
    if (filterData!== undefined) {
        const updatedBody = {...filterData,...req.body}
        const updatedData = data.map((ele)=>{
            if(ele.id === filterData.id){
                return updatedBody
            }else{
                return ele
            }
        })

        fs.writeFileSync(path.join(__dirname,"db/db.json"),JSON.stringify(updatedData));
        res.status(200).json({msg:'created', data: updatedBody});
    }else{
        res.status(404).json({msg:'not found'})
    }
})
app.delete("/api/:id", (req, res) => {
    const filterData = data.find((ele) => ele.id === Number(req.params.id));
    if (filterData!== undefined) {
        data.forEach((ele,index)=>{
            if(ele.id === filterData.id){
                data.splice(index,1)
            }
        })

        fs.writeFileSync(path.join(__dirname,"db/db.json"),JSON.stringify(data));
        res.status(200).json({msg:'deleted'});
    }else{
        res.status(404).json({msg:'not found'})
    }
  });

app.listen(4000, () => console.log("server running...", 4000));
