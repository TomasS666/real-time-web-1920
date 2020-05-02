let userRole = document.querySelector('select[name="userRole"')
let artistNameField = document.querySelector('label[for="artistName"]')
artistNameField.classList.add('hide')
userRole.addEventListener('change', function(e){
  if(this.value == 'visitor'){
    artistNameField.classList.add('hide')

  }else{
    artistNameField.classList.remove('hide')
  }
})