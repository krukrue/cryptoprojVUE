const tickersv = new Map();

const socket = new WebSocket(
  `wss://streamer.cryptocompare.com/v2?api_key=c535d1fe1979392ae7970e53cce4ea0b0a2a6a2f5c318cf1f22f23aeeed2d287`
);

const AGGREGATE_INDEX = '5';

socket.addEventListener('message', e => {
  const {TYPE: type, FROMSYMBOL: currency, PRICE: newPrice} = JSON.parse(e.data);
  if (type !== AGGREGATE_INDEX || newPrice === undefined )  {
    return
  }
  const handlers = tickersv.get(currency) ?? [];
  handlers.forEach((fn) => fn(newPrice));
   
})



function sendToWebSocket(message) {
  
  const stringif = JSON.stringify(message);
  if (socket.readyState === WebSocket.OPEN){
    socket.send(stringif);
    return
  }
  socket.addEventListener('open', () => {
    socket.send(stringif)
  }, {
    once: true
  })
}

function SubscribeToTickerOnWs(ticker){
  sendToWebSocket(({
    action: "SubAdd",
    subs: [`5~CCCAGG~${ticker}~USD`],
  }))

}

function unSubscribeToTickerOnWs(ticker){
  sendToWebSocket(({
    action: "SubRemove",
    subs: [`5~CCCAGG~${ticker}~USD`],
  }))
}



export const subscribeToTicker = (ticker, cb) => {
  const subs = tickersv.get(ticker) || [];
  tickersv.set(ticker, [...subs, cb]);
  SubscribeToTickerOnWs(ticker);
};

export const unSubscribeTicker = (ticker) => {
  //const subs = tickersv.get(ticker) || [];
  tickersv.delete(ticker)
  unSubscribeToTickerOnWs(ticker);
};


window.tickersv = tickersv;
