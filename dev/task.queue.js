
module.exports = {
	init: function task_queue_init(creep)
	{
		// pick a source to gather from.
		var options = creep.room.find(FIND_SOURCES).map(source => {
			var flag = manager.flag.flagForSource(source);

			if (flag)
			{
				return {
					flag: flag,
					weight: flag.memory.queue.waiting.length,
					range: creep.pos.getRangeTo(flag)
				};
			}
			else
			{ // handle sources without flag?  Not right now.
				return {
					weight: 99,
					range: 99
				}
			}
		});
		options.sort((a,b) => {
			return (a.weight - b.weight) || (a.range - b.range);
		});

		if (options[0].flag)
		{
			creep.memory.task = 'queue';
			creep.memory.queue = {
				flag: options[0].flag.name,
				target: options[0].flag.pos
			};

			console.log(creep.name, "queueing at", creep.memory.queue.name);

			module.exports.run(creep);
		}
		else {
			console.log("No energy source found for starved creep:", creep.name);
		}
	},
	run: function task_queue_run(creep)
	{ console.log(creep.name, "queueing");
		var flag = Game.flags[creep.memory.queue.flag];
		if (flag)
		{
			var q = flag.memory.queue;
			creep.moveTo(flag);

			if ((creep.getRangeTo(flag) <= q.range) &&
				(q.waiting.indexOf(creep.id) == -1))
			{
				q.waiting.push(creep.id);
			}
		}
		else
		{ manager.task.free(creep); }
	}
}
