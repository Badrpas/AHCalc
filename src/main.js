import $ from 'jquery';

const data = {
  buy: 0,
  even: 0,
  post: 0,
  profit: 0,
  multiplier: 1,
};
const history = [];

const cacheData = () => {
  localStorage.setItem('data', JSON.stringify(data));
  localStorage.setItem('history', JSON.stringify(history));
}
const restoreCache = () => {
  const dataStr = localStorage.getItem('data');
  if (dataStr) {
    Object.assign(data, JSON.parse(dataStr));
  }
  const historyStr = localStorage.getItem('history');
  if (historyStr) {
    history.push(...JSON.parse(historyStr));
  }
}


const updateValues = () => {
  Object.entries(data).forEach(([key, value]) => {
    $(`#${key}`).val(value.toFixed(2)).html(value.toFixed(2));
  });

  const dublicateIdxs = [];
  for (let idx = 1; idx < history.length; idx++) {
    const dublicate = Object.entries(data).every(([key, value]) => history[idx][key] === value);
    if (dublicate) {
      dublicateIdxs.push(idx);
    }
  }
  while (dublicateIdxs.length) {
    const idx = dublicateIdxs.pop();
    console.log('rm', idx);
    history.splice(idx, 1);
  }
  history.push({...data});

  renderHistory();
  cacheData();
}

function renderHistory() {
  $('#history').empty();
  const fields = ['buy', 'even', 'post', 'profit', 'multiplier', 'totalprofit'];
  for (const entry of history) {
    const row = $('<tr>').html(fields.map(name => {
      return $('<td>').html(entry[name]?.toFixed(2) || '??')
    }));

    const remBtn = $('<button>').html('[x]');
    row.append(remBtn);
    remBtn.on('click', () => {
      const idx = history.indexOf(entry);
      history.splice(idx, 1);
      cacheData();
      renderHistory();
    });
    $('#history').prepend(row);
  }
  const header = $('<tr>').html(fields.map(name => $('<th>').html(name)));
  $('#history').prepend(header);
}

const readVal = e => {
  if (!(e instanceof $)) {
    e = $(e);
  }
  const raw = e.val() || '0';
  let val = raw.replace(/ю/g, '.');
  const number = Number(val);
  if (isNaN(number)) {
    try {
      const evaled = eval(val);
      return +(evaled);
    } catch (e) {
      console.error(e);
    }
  }
  return number;
}

const updateProfit = () => {
  data.profit = data.post * 0.95 - data.buy;
  data.totalprofit = data.profit * data.multiplier;
}

restoreCache();
updateValues();
//renderHistory();

$('[name="calc"] #buy').on('change', e => {
  let b = readVal(e.currentTarget);
  data.buy = b;
  data.even = b / 0.95;
  data.post = data.even * 1.05;
  updateProfit();
  updateValues();
});

$('[name="calc"] #even').on('change', e => {
  data.even = readVal(e.currentTarget);
  data.buy = data.even * 0.95;
  data.post = data.even * 1.05
  updateProfit();
  updateValues();
});

$('[name="calc"] #post').on('change', e => {
  data.post = readVal(e.currentTarget);
  updateProfit();
  updateValues();
});

$('[name="calc"] #multiplier').on('change', e => {
  data.multiplier = readVal(e.currentTarget);
  updateProfit();
  updateValues();
});
