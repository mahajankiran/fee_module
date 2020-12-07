
const price_element = document.getElementById('fee_amount');
var price;
if(price_element!=null)
{
price  =parseInt(price_element.value);
}
const fees_status = document.getElementById("helper").getAttribute("data-fees_status");



const downloadReceiptBtn = document.getElementById('download-btn');




const payBtn = document.getElementById('pay-btn');




var stripeHandler = StripeCheckout.configure({
    key: stripePublicKey,
    locale: 'auto',
    token: function(token) {

        console.log(token);
        fetch('/student/pay_fee', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                stripeTokenId: token.id,
                stripeEmail: token.email,
                price: price * 100
            })
        }).then(function(res) {
            return res.json()
        }).then(function(data) {
            alert(data.message)

        }).catch(function(error) {
            console.log(error)
        })
    }
})


if(fees_status==0)
{
payBtn.addEventListener('click', () => {
    console.log(price)
    stripeHandler.open({
        amount: price * 100
    })
})

}


// if(fees_status==1)
// {
// downloadReceiptBtn.addEventListener('click', () => {

//     fetch('/student/download_fee_receipt' ).then( (res)=>{

//         console.log(res.data)

//         const pdfBlob = new Blob([res.data], { type: 'application/pdf' });



//     }).catch(function(error) {
//         console.log(error)
//     })
    
// })
// }