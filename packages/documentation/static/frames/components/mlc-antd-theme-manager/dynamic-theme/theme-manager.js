const colorInputsContainer = document.getElementById('color-inputs-container')

const themeManagerAttributes = [
  'primary-color',
  'info-color',
  'success-color',
  'processing-color',
  'error-color',
  'warning-color',
]

themeManagerAttributes.forEach(attr => {
  const input = document.createElement('input')
  input.setAttribute('type', 'color')
  input.setAttribute('value', '#1890FF')

  const inputWrapper = document.createElement('div')
  inputWrapper.setAttribute('class', 'color-picker-wrapper')
  inputWrapper.appendChild(input)

  const label = document.createElement('label')
  label.innerText = attr

  const inputContainer = document.createElement('div')
  inputContainer.setAttribute('class', 'input-container')
  inputContainer.appendChild(inputWrapper)
  inputContainer.appendChild(label)

  input.addEventListener(
    'input',
    event => { inputWrapper.style.backgroundColor = event.target.value }
  )

  colorInputsContainer.appendChild(inputContainer)
})
