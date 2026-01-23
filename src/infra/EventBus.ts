const listeners: { [channel: string]: Function[] } = {};

export function subscribe(canal: string, funcao: Function) {
  if (!listeners[canal]) {
    listeners[canal] = [];
  }
  listeners[canal].push(funcao);
}

export function publish(canal: string, dados: any) {
  if (listeners[canal]) {
    listeners[canal].forEach(funcao => funcao(dados));
  }
}
