// server/controller/paymentController.js
exports.getPayment=(req,res)=>{
    res.status(200).send({gateways:['phonepay','gpay'],
        banks:['hdfc','axis']
    })
}