import $ from 'jquery';

const codeBlocks = [...(() => {
  const str = localStorage.getItem('code_blocks');
  if (!str) return [];
  return JSON.parse(str);
})()];
const save = () => {
  localStorage.setItem('code_blocks', JSON.stringify(codeBlocks));
};


export const init = (data, updateData) => {
  const evals = [];
  const updateCodeBlocks = () => {
    codeBlocks.splice(0, codeBlocks.length);
    for (const $eval of evals) codeBlocks.push($eval.val());
    save();
  };

  const $evals = $('#evals');
  for (const code of codeBlocks) addEval(code);

  const $btn = $('#add-eval');
  $btn.on('click', () => {
    addEval();
    updateCodeBlocks();
  });

  function addEval(text = 'const a=123;') {
    const $container = $('<div>');
    const $eval = $('<textarea>').val(text);
    $container.append($eval);
    evals.push($eval);
    $evals.prepend($container);
    const run = () => {
      data;
      eval($eval.val());
      updateData();
    };
    $eval.on('input', updateCodeBlocks);
    $eval.on('keydown', (e) => {
      if (e.which === 13 && e.ctrlKey) run();
    });

    const $run = $('<button>').html('Run').addClass('run');
    $container.append($run);
    $run.on('click', run);
    const $del = $('<button>').html('X').addClass('del');
    $container.append($del);
    $del.on('click', () => {
      const idx = evals.indexOf($eval);
      evals.splice(idx, 1);
      updateCodeBlocks();
      $eval.remove();
    });
  }
};

