import * as Types from "../data";

export class Trigger {
  #triggerRules: Array<Types.TriggerRule> = [];
  #triggers: Array<Types.TriggerType> = [];

  public get triggerRules() {
    return this.#triggerRules;
  }

  public addTriggerRule(t: Types.TriggerRule) {
    this.#triggerRules.push(t);
  }

  public addTrigger(t: Types.TriggerType) {
    this.#triggers.push(t);
  }

  public addLoadFile(fileName: string, comment: string) {
    this.addTriggerRule({
      actions: [
        {
          file: fileName,
          predicate: "a_do_script_file",
        },
      ],
      comment: comment,
      predicate: "triggerStart",
      rules: [],
    });
    const id = this.#triggers.length + 1;
    this.addTrigger({
      // eslint-disable-next-line no-useless-escape
      action: `a_do_script_file(getValueResourceByKey(\"${fileName}\"));`,
      func: null,
      conditions: "return(true)",
      funcStartup: `if mission.trig.conditions[${id}]() then mission.trig.actions[${id}]() end`,
    });
  }

  /**
   * Create a trigger for late activation
   *
   * @param group   group object
   * @param delay   delay in seconds
   */
  public addLateActivationTrigger(
    group: { groupId: number; name: string },
    delay: number
  ) {
    this.addTriggerRule({
      actions: [
        {
          predicate: "a_activate_group",
          group: group.groupId,
        },
      ],
      comment: `Delay Activation ${group.name}`,
      predicate: "triggerOnce",
      rules: [
        {
          predicate: "c_time_after",
          seconds: delay,
        },
      ],
    });
    const id = this.#triggers.length + 1;
    this.addTrigger({
      action: `a_activate_group(${group.groupId});a_out_text_delay(getValueDictByKey("${group.name}"), 10, false, 0); mission.trig.func[${id}]=nil;`,
      func: `if mission.trig.conditions[${id}]() then mission.trig.actions[${id}]() end`,
      conditions: `return(c_time_after(${Math.round(delay)}) )`,
      funcStartup: null,
    });
  }

  public generateTriggerRules() {
    return this.#triggerRules.map((tr) => tr);
  }

  public generateTrig() {
    return {
      actions: this.#triggers.map((t) => t.action),
      events: {},
      custom: {},
      func: this.#triggers.map((t) => t.func),
      flag: this.#triggers.map(() => true),
      conditions: this.#triggers.map((t) => t.conditions),
      customStartup: {},
      funcStartup: this.#triggers.map((t) => t.funcStartup),
    };
  }
}
