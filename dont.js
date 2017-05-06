var jogadores = {};
var jogadorSelecionado = "";

function getJogadores(data) {
  jogadores = JSON.parse(atob(data));
  console.log(jogadores);
};

$( document ).ready(function() {
  var array = $.map(jogadores, function(value, index) {
      return value;
  });

  $.each(array, function (i, jogador) {
      var tabela = $('#modelo').clone();

      var nome = '<span id="nick">' + jogador['nick'] + '</span>';

      var linkAdd = "<span class='addMatch'>+</span>";

      tabela.find('#nome').append(nome);
      tabela.find('#nick').after(linkAdd);
      tabela.css('display','');

      $.each(jogador['matches'], function(i, m){
        tabela.find('#match').after('<tr id="wl"><td>'+ m['wl'] +'</td><td>'+ m['opponent'] +'</td></tr>');
      });

      $('#body').append(tabela);
    });

  $.each(array, function (i, jogador) {
      $('#selectJogadores').append($('<option>', {
          value: jogador['nick'],
          text : jogador['nick']
      }));
  });

});

function addJogador(nick){
  var jogador = {};
  jogador['nick'] = nick;
  jogador['matches'] = [];

  jogadores[nick] = jogador;

  saveJogadores();
}

function saveJogadores(){
  var cb = jogadoresToCb(jogadores);

  $.ajax({
				data: cb,
				url: 'http://dontpad.com/liguinhadoamorbolsa/jogadores',
		        contentType: "application/x-www-form-urlencoded;charset=UTF-8",
		        type: "POST",
		        dataType: 'json',
		        success: function(result) {
		        	location.reload();
		        },
            error: function(result) {
		        	location.reload();
		        }
			});
}

function jogadoresToCb(json) {

    var data = {};

    data['text'] = "getJogadores('" + btoa(JSON.stringify(json)) + "');";

    console.log(json);

    return data;
}

$(document).on('click', '.addMatch', function(){

  jogadorSelecionado = $(this).prev('span').text();

  $('#div-modal-addMatch').show();
});

$(document).on('click', '.close', function(){
  $('#div-modal-addMatch').hide();
});

$(document).on('click', '#addMatch', function(e){
  e.preventDefault();

  var oponente = $('#selectJogadores').val();
  var resultado = $('input[name=wl]:checked').val();

  var match = {
    wl:resultado,
    opponent:oponente
  }

  jogadores[jogadorSelecionado]['matches'].push(match);

  var resultadoInverso = resultado == 'W' ? 'L' : 'W';

  var matchInversa = {
    wl:resultadoInverso,
    opponent:jogadorSelecionado
  }

  jogadores[oponente]['matches'].push(matchInversa);

  saveJogadores();

  $('#div-modal-addMatch').hide();
});


$(document).on('click', '#btn-add-jogador', function(e){
  e.preventDefault();

  var jogador = $(this).prev('input').val();

  addJogador(jogador);

  $('#div-modal-addMatch').hide();
});
