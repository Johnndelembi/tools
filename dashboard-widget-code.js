```javascript
class WidgetCodeGenerator {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) {
      console.error('WidgetCodeGenerator: Container not found.');
      return;
    }
    this.init();
  }

  init() {
    // Create UI
    this.container.innerHTML = `
      <div class="widget-code-generator">
        <h3>Generate Chat Widget</h3>
        <label>Name:</label>
        <input type="text" class="name-input" placeholder="Enter name (e.g., John)" />
        <label>WA ID:</label>
        <input type="text" class="wa-id-input" placeholder="Enter WA ID (e.g., 123)" />
        <button class="preview-btn">Preview Widget</button>
        <div class="preview-container" style="display: none;">
          <h4>Preview</h4>
          <div class="preview-widget"></div>
        </div>
        <button class="get-code-btn" style="display: none;">Get Widget Code</button>
        <textarea class="code-output" style="display: none;" readonly></textarea>
      </div>
    `;

    // Apply styles
    const styles = `
      <style>
        .widget-code-generator {
          padding: 20px;
          background: #f9f9f9;
          border-radius: 10px;
          max-width: 500px;
          margin: 20px auto;
        }
        .widget-code-generator h3, .widget-code-generator h4 {
          margin: 0 0 10px;
        }
        .widget-code-generator label {
          display: block;
          margin: 10px 0 5px;
        }
        .widget-code-generator input {
          width: 100%;
          padding: 8px;
          border: 1px solid #ddd;
          border-radius: 5px;
        }
        .widget-code-generator button {
          padding: 10px 20px;
          background: #007bff;
          color: #fff;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          margin: 10px 0;
        }
        .widget-code-generator .code-output {
          width: 100%;
          height: 100px;
          margin-top: 10px;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 5px;
        }
      </style>
    `;
    document.head.insertAdjacentHTML('beforeend', styles);

    // Bind elements
    this.nameInput = this.container.querySelector('.name-input');
    this.waIdInput = this.container.querySelector('.wa-id-input');
    this.previewButton = this.container.querySelector('.preview-btn');
    this.getCodeButton = this.container.querySelector('.get-code-btn');
    this.previewContainer = this.container.querySelector('.preview-container');
    this.previewWidget = this.container.querySelector('.preview-widget');
    this.codeOutput = this.container.querySelector('.code-output');

    // Attach event listeners
    this.previewButton.addEventListener('click', () => this.previewWidget());
    this.getCodeButton.addEventListener('click', () => this.copyCode());
  }

  previewWidget() {
    const name = this.nameInput.value.trim();
    const wa_id = this.waIdInput.value.trim();

    if (!name || !wa_id) {
      alert('Please enter both Name and WA ID.');
      return;
    }

    // Clear previous widget
    this.previewWidget.innerHTML = '<div id="chatbot-preview"></div>';

    // Initialize widget for preview
    new ChatBotWidget({
      apiUrl: 'http://localhost:8000/webhook/message',
      position: 'bottom-right',
      wa_id: wa_id,
      name: name
    });

    // Show preview and code button
    this.previewContainer.style.display = 'block';
    this.getCodeButton.style.display = 'block';
    this.generateCode(name, wa_id);
  }

  generateCode(name, wa_id) {
    const code = `
<!-- ChatBot Pro Widget -->
<div id="chatbot-widget"></div>
<script>
  (function() {
    var script = document.createElement('script');
    script.src = 'https://0dc3876f-7ad4-4bfc-9e46-8e80fb356706.lovableproject.com/widget.js';
    script.async = true;
    script.onload = function() {
      new ChatBotWidget({
        apiUrl: 'http://localhost:8000/webhook/message',
        position: 'bottom-right',
        wa_id: '${wa_id}',
        name: '${name}'
      });
    };
    document.head.appendChild(script);
  })();
</script>
    `.trim();

    this.codeOutput.value = code;
    this.codeOutput.style.display = 'block';
  }

  copyCode() {
    this.codeOutput.select();
    document.execCommand('copy');
    alert('Widget code copied to clipboard!');
  }
}

// Initialize on dashboard page
document.addEventListener('DOMContentLoaded', () => {
  new WidgetCodeGenerator('widget-code-container');
});
```
