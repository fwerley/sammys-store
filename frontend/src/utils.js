export const APP_ID_FB = 1180331102646514;

export const getError = (error) => {
  return error.response && error.response.data.message
    ? error.response.data.message
    : error.message;
};

export const shuffle = (array) => {
  var m = array.length, t, i;
  // Enquanto restam elementos para embaralhar…
  while (m) {
    // Escolha um elemento restante…
    i = Math.floor(Math.random() * m--);
    // E troque-o pelo elemento atual.
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }
  return array;
}

export const formatCoin = (value) => {
  return new Intl.NumberFormat("pt-BR", { style: 'currency', currency: "BRL" }).format(value);
}

export const formatedDate = (date) => {
  try {
    let newDate = new Date(date)
    return newDate.toLocaleDateString('pt-BR')
  } catch (error) {
    console.log(error)
  }
}

export const formatHour = (date) => {
  try {
    let newDate = new Date(date)
    return newDate.toLocaleTimeString('pt-BR')
  } catch (error) {
    console.log(error)
  }
}

export const estados = [
  { "label": "Acre", "sigla": "AC" },
  { "label": "Alagoas", "sigla": "AL" },
  { "label": "Amapá", "sigla": "AP" },
  { "label": "Amazonas", "sigla": "AM" },
  { "label": "Bahia", "sigla": "BA" },
  { "label": "Ceará", "sigla": "CE" },
  { "label": "Distrito Federal", "sigla": "DF" },
  { "label": "Espírito Santo", "sigla": "ES" },
  { "label": "Goiás", "sigla": "GO" },
  { "label": "Maranhão", "sigla": "MA" },
  { "label": "Mato Grosso", "sigla": "MT" },
  { "label": "Mato Grosso do Sul", "sigla": "MS" },
  { "label": "Minas Gerais", "sigla": "MG" },
  { "label": "Pará", "sigla": "PA" },
  { "label": "Paraíba", "sigla": "PB" },
  { "label": "Paraná", "sigla": "PR" },
  { "label": "Pernambuco", "sigla": "PE" },
  { "label": "Piauí", "sigla": "PI" },
  { "label": "Rio de Janeiro", "sigla": "RJ" },
  { "label": "Rio Grande do Norte", "sigla": "RN" },
  { "label": "Rio Grande do Sul", "sigla": "RS" },
  { "label": "Rondônia", "sigla": "RO" },
  { "label": "Roraima", "sigla": "RR" },
  { "label": "Santa Catarina", "sigla": "SC" },
  { "label": "São Paulo", "sigla": "SP" },
  { "label": "Sergipe", "sigla": "SE" },
  { "label": "Tocantins", "sigla": "TO" }
]

export const subtractMonths = (date, months) => {
  date.setMonth(date.getMonth() - months);
  return date;
}

export const arrayMonth = [
  "janeiro",
  "fevereiro",
  "março",
  "abril",
  "maio",
  "junho",
  "julho",
  "agosto",
  "setembro",
  "outubro",
  "novembro",
  "dezembro"
]

export const translatePaymentMethod = (status) => {
  const statusMap = {
    CREDIT_CARD: "Cartão de crédito",
    BILLET: "Boleto",
    PIX: "PIX",
  }

  return statusMap[status]
}
