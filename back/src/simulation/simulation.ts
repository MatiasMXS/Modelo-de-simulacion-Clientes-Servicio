
type State = {
  clock: number;
  nextArrival: number;
  nextDeparture: number;
  PS: 0 | 1;
  Q: number;
}

type EventType = 'arrival' | 'departure';
type SimulationConfig = {
  arrivalTimes: number[];
  serviceTimes: number[];

  startTime: number;
  firstArrival: number;
  firstDeparture: number;
  initialQueue: number;
  endTime: number;
};

function randomBetween(min: number, max: number): number {
  return Math.random() * (max - min) + min
}

function handleArrival(state: State) {
  state.clock = state.nextArrival;
  state.nextArrival = state.clock + randomBetween(10, 30);

  if (state.PS === 0) {
    state.PS = 1;
    state.nextDeparture = state.clock + randomBetween(10, 20);
  } else {
    state.Q += 1;
  }
}

function handleDeparture(state: State) {
  state.clock = state.nextDeparture;

  if (state.Q > 0) {
    state.Q -= 1;
    state.nextDeparture = state.clock + randomBetween(10, 20);
  } else {
    state.PS = 0;
    state.nextDeparture = Infinity;
  }
}

function getNextEvent(state: State): EventType {
  return state.nextArrival < state.nextDeparture
    ? 'arrival'
    : 'departure';
}

function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;

  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function simulate(config: SimulationConfig, steps: number = 10) {
  let arrivalIndex = 0;
  let serviceIndex = 0;

  const arrivalInterval = config.arrivalTimes[0];
  const serviceInterval = config.serviceTimes[0];

  const getNextArrivalTime = () => arrivalInterval;
  const getNextServiceTime = () => serviceInterval;

  const state: State = {
    clock: config.startTime,
    nextArrival: config.firstArrival,
    nextDeparture: config.firstDeparture,
    PS: config.firstDeparture !== Infinity ? 1 : 0,
    Q: config.initialQueue,
  };

  const table = [];

  console.log("CONFIG:", config);
  console.log("INITIAL STATE:", state);
  while (state.clock <= config.endTime) {

    const event =
      state.nextArrival < state.nextDeparture
        ? "arrival"
        : "departure";
    console.log("EVENT:", event, "CLOCK:", state.clock);
    if (event === "arrival") {
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
      clock: formatTime(state.clock),
      nextArrival: formatTime(state.nextArrival),
      nextDeparture:
        state.nextDeparture === Infinity
          ? "-"
          : formatTime(state.nextDeparture),
      Q: state.Q,
      PS: state.PS,
      event,
    });
  }

  return table;
}


