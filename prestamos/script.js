    // Mostrar la fecha actual en el contrato
    document.getElementById("contractDate").textContent = new Date().toLocaleDateString("es-ES");

    // Función para formatear la fecha en formato largo
    function formatDate(date) {
      const options = { day: 'numeric', month: 'long', year: 'numeric' };
      return new Date(date + 'T00:00:00').toLocaleDateString("es-ES", options);
    }

    // Función para formatear números: si es entero, sin decimales; de lo contrario, con decimales necesarios.
    function formatNumber(num) {
      if (Number.isInteger(num)) {
        return num.toString();
      } else {
        return parseFloat(num.toFixed(2)).toString();
      }
    }

    // Función para actualizar la fecha final automáticamente
    function updateFinalDate() {
      const loanDateInput = document.getElementById("loanDate").value;
      const frequency = document.getElementById("frequency").value;
      const duration = parseInt(document.getElementById("duration").value);
      if (loanDateInput && !isNaN(duration)) {
        let startDate = new Date(loanDateInput);
        let endDate = new Date(startDate);
        if (frequency === "mensual") {
          endDate.setMonth(endDate.getMonth() + duration);
        } else if (frequency === "diario") {
          endDate.setDate(endDate.getDate() + duration);
        }
        // Actualizamos el input con el formato yyyy-mm-dd
        document.getElementById("finalDate").value = endDate.toISOString().split('T')[0];
      }
    }

    // Actualizar la fecha final al cambiar los valores
    document.getElementById("loanDate").addEventListener("change", updateFinalDate);
    document.getElementById("frequency").addEventListener("change", updateFinalDate);
    document.getElementById("duration").addEventListener("input", updateFinalDate);

// Evento para generar el contrato
// Evento para generar el contrato
document.getElementById("loanForm").addEventListener("submit", function(event) {
  event.preventDefault();

  const lender = document.getElementById("lender").value.toUpperCase();
  const borrower = document.getElementById("borrower").value.toUpperCase();
  const amount = parseFloat(document.getElementById("amount").value);
  const interestPercent = parseFloat(document.getElementById("interest").value);
  const interestRate = interestPercent / 100;
  const loanDateVal = document.getElementById("loanDate").value;
  const finalDateVal = document.getElementById("finalDate").value;
  const lateFee = parseFloat(document.getElementById("lateFee").value);
  const frequency = document.getElementById("frequency").value;
  const duration = parseInt(document.getElementById("duration").value);
  const dni = document.getElementById("dni").value;
  const address = document.getElementById("address").value;
  const gender = document.getElementById("gender").value;  // Nuevo input de género

  // Definir los términos según el género
  let borrowerTerm, signatureTerm, residenceTerm;
  if (gender === "femenino") {
    borrowerTerm = "prestataria";
    signatureTerm = "Firma de la Prestataria";
    residenceTerm = "residenciada";
  } else {
    borrowerTerm = "prestatario";
    signatureTerm = "Firma del Prestatario";
    residenceTerm = "residenciado";
  }

  // Cálculo:
  let totalPayable, installment;
  if (frequency === "mensual") {
    installment = amount * interestRate;
    totalPayable = amount + (amount * interestRate);
  } else if (frequency === "diario") {
    totalPayable = amount + (amount * interestRate);
    installment = totalPayable / duration;
  }

  const periodText = frequency === "mensual" ? "mensual" : "diario";
  const periodLabel = frequency === "mensual" ? "meses" : "días";

  // Generar el contenido del contrato usando los términos definidos
  const contractText = `
    <h2 class='text-xl font-bold text-center'>CONTRATO DE PRÉSTAMO</h2>
    <p class='font-bold'>${formatDate(loanDateVal)}</p>
    <p>
      Yo, <strong>${borrower}</strong>, con DNI <strong>${dni}</strong>, ${borrowerTerm}, ${residenceTerm} en <strong>${address}</strong>, 
      recibo de <strong>${lender}</strong>, prestamista, la cantidad de 
      <strong>${amount} nuevos soles (S/.${amount})</strong>. Me comprometo a devolver dicho monto más un 
      <strong>${interestPercent}% de interés</strong>, resultando en un total de 
      <strong>${formatNumber(totalPayable)} nuevos soles (S/.${formatNumber(totalPayable)})</strong>. Dado que el préstamo se otorga por <strong>${duration} ${periodLabel}</strong>, el pago ${periodText} será de 
      <strong>${formatNumber(installment)} nuevos soles (S/.${formatNumber(installment)})</strong>. La fecha final de pago es el <strong>${formatDate(finalDateVal)}</strong>. En caso de mora, se aplicará un cargo de <strong>${lateFee} nuevos soles (S/.${lateFee})</strong> por día de retraso.
    </p>
    <p class='mt-4'>Firmado en conformidad.</p>
    <p class='font-bold mt-2'>${signatureTerm}</p>
    <p class='font-bold'>${borrower}</p>
  `;
  document.getElementById("contractOutput").innerHTML = contractText;
  document.getElementById("contractOutput").classList.remove("hidden");
  document.getElementById("downloadPDF").classList.remove("hidden");
});

// Evento para descargar el contrato en PDF utilizando html2pdf.js
document.getElementById("downloadPDF").addEventListener("click", function() {
  const borrowerName = document.getElementById("borrower").value.toUpperCase();
  const loanDate = document.getElementById("loanDate").value;
  // Convertir la fecha de "yyyy-mm-dd" a "dd/mm/yyyy"
  let formattedDate = loanDate.split("-").reverse().join("/");
  
  const element = document.getElementById("contractOutput");
  const opt = {
    margin: 0.5,
    filename: `${borrowerName} - ${formattedDate}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
  };
  html2pdf().set(opt).from(element).save();
});
