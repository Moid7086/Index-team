const buttons = document.querySelectorAll('.btnref');

buttons.forEach(button=>{
    button.addEventListener('click', function(){
        const value = this.value;
        window.location.href = this.value
        console.log(""+ this.value)
    })
})