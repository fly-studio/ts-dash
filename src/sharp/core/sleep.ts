namespace sharp.sleeping {
	let _motionWakeThreshold: number = 0.18;
	let _motionSleepThreshold: number = 0.08;
	let _minBias: number = 0.9;

	/**
     * Puts bodies to sleep or wakes them up depending on their motion.
     * @method update
     * @param {body[]} bodies
     * @param {number} timeScale
     */
	export function update(bodies: body.Body[], timeScale: number) {
		let timeFactor = timeScale * timeScale * timeScale;

		// update bodies sleeping status
		for (let i = 0; i < bodies.length; i++) {
			let body = bodies[i],
				motion = body.speed * body.speed + body.angularSpeed * body.angularSpeed;

			// wake up bodies if they have a force applied
			if (body.force.x !== 0 || body.force.y !== 0) {
				set(body, false);
				continue;
			}

			let minMotion = Math.min(body.motion, motion),
				maxMotion = Math.max(body.motion, motion);

			// biased average motion estimation between frames
			body.motion = _minBias * minMotion + (1 - _minBias) * maxMotion;

			if (body.sleepThreshold > 0 && body.motion < _motionSleepThreshold * timeFactor) {
				body.sleepCounter += 1;

				if (body.sleepCounter >= body.sleepThreshold)
					set(body, true);
			} else if (body.sleepCounter > 0) {
				body.sleepCounter -= 1;
			}
		}
	};

    /**
     * Given a set of colliding pairs, wakes the sleeping bodies involved.
     * @method afterCollisions
     * @param {pair[]} pairs
     * @param {number} timeScale
     */
	export function afterCollisions(pairs: Pair[], timeScale: number) {
		let timeFactor = timeScale * timeScale * timeScale;

		// wake up bodies involved in collisions
		for (let i = 0; i < pairs.length; i++) {
			let pair = pairs[i];

			// don't wake inactive pairs
			if (!pair.isActive)
				continue;

			let collision = pair.collision,
				bodyA = collision.bodyA.parent,
				bodyB = collision.bodyB.parent;

			// don't wake if at least one body is static
			if ((bodyA.isSleeping && bodyB.isSleeping) || bodyA.isStatic || bodyB.isStatic)
				continue;

			if (bodyA.isSleeping || bodyB.isSleeping) {
				let sleepingBody = (bodyA.isSleeping && !bodyA.isStatic) ? bodyA : bodyB,
					movingBody = sleepingBody === bodyA ? bodyB : bodyA;

				if (!sleepingBody.isStatic && movingBody.motion > _motionWakeThreshold * timeFactor) {
					set(sleepingBody, false);
				}
			}
		}
	};

	 /**
     * Set a body as sleeping or awake.
     * @method set
     * @param {body} body
     * @param {boolean} isSleeping
     */
	export function set(body: body.Body, isSleeping: boolean)
	{
		let wasSleeping = body.isSleeping;

		if (isSleeping) {
			body.isSleeping = true;
			body.sleepCounter = body.sleepThreshold;

			body.positionImpulse.x = 0;
			body.positionImpulse.y = 0;

			body.positionPrev.x = body.position.x;
			body.positionPrev.y = body.position.y;

			body.anglePrev = body.angle;
			body.speed = 0;
			body.angularSpeed = 0;
			body.motion = 0;

			if (!wasSleeping) {
				events.trigger(body, 'sleepStart');
			}
		} else {
			body.isSleeping = false;
			body.sleepCounter = 0;

			if (wasSleeping) {
				events.trigger(body, 'sleepEnd');
			}
		}
	}
}