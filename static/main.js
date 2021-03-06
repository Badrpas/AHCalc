import $ from 'jquery';

const data = {
  buy: 0,
  even: 0,
  post: 0
};

const updateValues = () => {
  let historyEntries = [];
  Object.entries(data).forEach(([key, value]) => {
    historyEntries.push(value = (+value).toFixed(4));
    $(`[name=calc] #${key}`).val(value).html(value);
  });

  $('#history').prepend($('<li>').html(historyEntries.join(' / ')));
}

const readVal = e => {
  if (!(e instanceof $)) {
    e = $(e);
  }
  return e.val() || 0;
}

const updateProfit = () => {
  data.profit = data.post * 0.95 - data.buy;
}



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