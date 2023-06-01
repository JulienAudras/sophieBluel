console.log('test')

fetch('http://localhost:5678/api-docs/works')
.then(function(response) {
  return response.json()
})
.then(function(res) {
  console.log(res)
});