
type State ={
    clock: number;
    nextArrival: number;
    nextDeparture: number;
    PS: 0 | 1;
    Q: number;
}

type EventType = 'arrival' | 'departure';
type SimulationConfig = {
  arrivalTimes: number[];   // tiempos entre llegadas
  serviceTimes: number[];   // tiempos de servicio
};

function randomBetween(min: number, max:number): number{
    return Math.random()*(max - min) + min
}

function handleArrival(state: State){
    state.clock = state.nextArrival;
    state.nextArrival = state.clock + randomBetween(10, 30);

    if(state.PS === 0){
        state.PS = 1;
        state.nextDeparture = state.clock + randomBetween(10, 20);
    } else {
        state.Q += 1;
    }
}

function handleDeparture(state: State){
    state.clock = state.nextDeparture;

    if(state.Q > 0){
        state.Q -= 1;
        state.nextDeparture = state.clock + randomBetween(10, 20);
    } else {
        state.PS = 0;
        state.nextDeparture = Infinity;
    }
}

function getNextEvent(state: State):EventType {
    return state.nextArrival < state.nextDeparture 
    ? 'arrival' 
    : 'departure';
}


export function simulate(config: SimulationConfig, steps: number = 10) {
  let arrivalIndex = 0;
  let serviceIndex = 0;

  const getNextArrivalTime = () =>
    config.arrivalTimes[arrivalIndex++] ?? 0;

  const getNextServiceTime = () =>
    config.serviceTimes[serviceIndex++] ?? 0;

  const state = {
    clock: 0,
    nextArrival: getNextArrivalTime(),
    nextDeparture: Infinity,
    PS: 0 as 0 | 1,
    Q: 0,
  };

  const table = [];

  for (let i = 0; i < steps; i++) {
    const event =
      state.nextArrival < state.nextDeparture
        ? "ARRIVAL"
        : "DEPARTURE";

    if (event === "ARRIVAL") {
      state.clock = state.nextArrival;

      state.nextArrival =
        state.clock + getNextArrivalTime();

      if (state.PS === 0) {
        state.PS = 1;
        state.nextDeparture =
          state.clock + getNextServiceTime();
      } else {
        state.Q++;
      }
    } else {
      state.clock = state.nextDeparture;

      if (state.Q > 0) {
        state.Q--;
        state.nextDeparture =
          state.clock + getNextServiceTime();
      } else {
        state.PS = 0;
        state.nextDeparture = Infinity;
      }
    }

    table.push({
      clock: state.clock,
      nextArrival: state.nextArrival,
      nextDeparture:
        state.nextDeparture === Infinity ? "-" : state.nextDeparture,
      Q: state.Q,
      PS: state.PS,
      event,
    });
  }

  return table;
}


   