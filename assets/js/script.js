const selectBox = document.getElementById("select-box");
const inputBox = document.getElementById("input-box")
const API = "https://mindicador.cl/api/"
btnSearch = document.getElementById("btn-search"),
resultText = document.getElementById("result"),
canvasChart = document.getElementById("chart");

async function getValues(indicador = ""){
    try{
        const response = await fetch(API.concat(indicador));
        return response.ok ? await response.json() : alert("Recurso no disponible");
    } catch (error){
        return error.message;
    }
}

async function fillSelectBox(){
    const values = await getValues();
    if(values){
        let html = "";
        Array.from(Object.entries(values)).forEach((value) => {
            if(
                value[1].codigo == undefined ||
                value[1].codigo == "tpm" ||
                value[1].codigo == "ipc" ||
                value[1].codigo == "marec" 
            ){
                console.log(`Ignorado ${value[1].codigo}`);
            } 
            else { 
            html += `<option value="${value[1].codigo}">${value[1].nombre}</option>`;
            }
        });
        selectBox.innerHTML = html;
    }
}

async function getResults(_from, _to){
    const values = await getValues();
    formatResult = (_from / values[`${_to}`].valor).toFixed(2); 
    resultText.innerHTML = `Resultado: ${formatResult}`;
}


// Configuración de gráfico
function getConfigChart(_data){
    const xLabels = _data.map(item => item.fecha.substring(0,10))
    const yLabels = _data.map((item) => item.valor);
    const config = {
        type: "line", 
        data: {
            labels: xLabels,
            datasets: [{
                label: "Últimos 10 cambios",
                data: yLabels
            }
            ],
            borderWidth: 3,
        },
        options: {
            responsive: true,
        }}

    return config; 
}

// Render del gráfico
async function renderChart(indicator){
    const values = await getValues(indicator);
    const valuesFilter = values.serie.filter((item, index) => index < 10);
    const config = getConfigChart(valuesFilter);

    let chartStatus = Chart.getChart(canvasChart);
    if (chartStatus != undefined) {
        chartStatus.destroy();
    }

    new Chart (canvasChart, config);
}

btnSearch.addEventListener("click", function(){
    inputBox.value != ""
    ? getResults(inputBox.value, selectBox.value) &&
    renderChart(selectBox.value)
    : alert("Debes ingresar un valor en CLP");
});

fillSelectBox()
