"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const spec_1 = require("../src/spec");
const ir_1 = require("../src/ir");
const validate_1 = require("../src/validate");
const simulate_1 = require("../src/simulate");
const spec = {
    id: 'order_fulfillment',
    version: 'v1',
    start: 'charge_card',
    steps: {
        charge_card: { type: 'task', next: 'reserve_inventory' },
        reserve_inventory: { type: 'task', next: 'ship_order' },
        ship_order: { type: 'task', end: true },
    },
};
test('parse, IR, validate, simulate', () => {
    const parsed = (0, spec_1.parseSpec)(spec);
    const ir = (0, ir_1.toIR)(parsed);
    const diags = (0, validate_1.validateIR)(ir);
    expect(diags.find((d) => d.severity === 'error')).toBeUndefined();
    const trace = (0, simulate_1.simulate)(ir);
    expect(trace.path).toEqual([
        'charge_card',
        'reserve_inventory',
        'ship_order',
    ]);
});
