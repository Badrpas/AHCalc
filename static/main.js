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



$('[name="calc"] #buy').on('change', e => {
  let b = readVal(e.currentTarget);
  data.buy = b;
  data.even = b / 0.95;
  data.post = data.even * 1.05;
  data.profit = data.post - data.even;
  updateValues();
});