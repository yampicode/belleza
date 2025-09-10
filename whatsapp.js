
    (function(){
      // Replace with the owner's WhatsApp number in international format without '+' or dashes.
      // Example Mexico: +52 1 55 1234 5678 -> 5215512345678
      var OWNER_WHATSAPP_NUMBER = "584120348988"; // <-- REEMPLAZA AQUÍ con el número del propietario

      // Set min date for date field to today
      var today = new Date().toISOString().split('T')[0];
      var dateInput = document.getElementById('date');
      if(dateInput) dateInput.setAttribute('min', today);

      // Update year in footer
      document.getElementById('year').textContent = new Date().getFullYear();

      var form = document.getElementById('bookingForm');
      var status = document.getElementById('form-status');
      var submitBtn = document.getElementById('submitBtn');

      function validateForm(formEl){
        // Uses HTML5 constraint validation, but also custom checks
        if(!formEl.checkValidity()){
          formEl.reportValidity();
          return false;
        }
        return true;
      }

      form.addEventListener('submit', function(e){
        e.preventDefault();
        status.textContent = '';

        if(!validateForm(form)) return;

        // Collecting values
        var data = {
          name: form.name.value.trim(),
          phone: form.phone.value.trim(),
          email: form.email.value.trim(),
          service: form.service.value,
          date: form.date.value,
          time: form.time.value,
          message: form.message.value.trim()
        };

        // Build a friendly message
        var lines = [];
        lines.push("Nueva solicitud de reserva desde el sitio web:");
        if(data.name) lines.push("Nombre: " + data.name);
        if(data.phone) lines.push("Tel/WhatsApp: " + data.phone);
        if(data.email) lines.push("Correo: " + data.email);
        if(data.service) lines.push("Servicio: " + data.service);
        if(data.date) lines.push("Fecha: " + data.date);
        if(data.time) lines.push("Hora: " + data.time);
        if(data.message) lines.push("Mensaje: " + data.message);

        var finalMessage = lines.join("%0A"); // %0A -> newline in URL encoding

        // Build WhatsApp URL (web): use https://wa.me/<number>?text=<encoded>
        if(!OWNER_WHATSAPP_NUMBER || OWNER_WHATSAPP_NUMBER.indexOf("REPLACE") !== -1){
          status.textContent = "Error: número de WhatsApp del propietario no configurado. Edite el código e introduzca OWNER_WHATSAPP_NUMBER.";
          return;
        }

        var waBase = "https://wa.me/" + encodeURIComponent(OWNER_WHATSAPP_NUMBER) + "?text=" + finalMessage;
        // Open in new tab/window — mobile will open WhatsApp app if available
        window.open(waBase, '_blank', 'noopener');

        // Provide feedback
        status.textContent = "Se abrirá WhatsApp con la información. Completa el mensaje si deseas y envíalo.";
      });

      // Accessibility: allow Enter to trigger submit when focused on button
      submitBtn.addEventListener('keyup', function(e){
        if(e.key === 'Enter') submitBtn.click();
      });
    })();

