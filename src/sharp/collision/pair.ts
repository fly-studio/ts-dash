namespace sharp {
	export class Pair {

		public id: string;
		public collision: Collision;
		public bodyA: Body;
		public bodyB: Body;
		public contacts: Map<number, Contact> = new Map<number, Contact>();
		public activeContacts: Contact[] = [];
		public separation: number = 0;
		public isActive: boolean = true;
		public isSensor: boolean = false;
		public timeCreated: number = 0;
		public timeUpdated: number = 0;
		public inverseMass: number = 0;
		public friction: number = 0;
		public frictionStatic: number = 0;
		public restitution: number = 0;
		public slop: number = 0;

		constructor(collision: Collision, timestamp: number)
		{
			let bodyA = collision.bodyA,
				bodyB = collision.bodyB,
				parentA = collision.parentA,
				parentB = collision.parentB;

			this.bodyA = bodyA;
			this.bodyB = bodyB;
			this.id = Pair.getID(bodyA, bodyB);
			this.isSensor = bodyA.isSensor || bodyB.isSensor;
			this.timeCreated = timestamp;
			this.timeUpdated = timestamp;
			this.inverseMass = parentA.inverseMass + parentB.inverseMass;
			this.friction = Math.min(parentA.friction, parentB.friction);
			this.frictionStatic = Math.max(parentA.frictionStatic, parentB.frictionStatic);
			this.restitution = Math.max(parentA.restitution, parentB.restitution);
			this.slop = Math.max(parentA.slop, parentB.slop);

			this.update(collision, timestamp);
		}

		/**
		 * Updates a pair given a collision.
		 * @method update
		 * @param {pair} pair
		 * @param {collision} collision
		 * @param {number} timestamp
		 */
		public update(collision: Collision, timestamp: number) {
			let contacts = this.contacts,
				supports = collision.supports,
				activeContacts = this.activeContacts,
				parentA = collision.parentA,
				parentB = collision.parentB;

			this.collision = collision;
			this.inverseMass = parentA.inverseMass + parentB.inverseMass;
			this.friction = Math.min(parentA.friction, parentB.friction);
			this.frictionStatic = Math.max(parentA.frictionStatic, parentB.frictionStatic);
			this.restitution = Math.max(parentA.restitution, parentB.restitution);
			this.slop = Math.max(parentA.slop, parentB.slop);
			activeContacts.length = 0;

			if (collision.collided) {
				for (let i = 0; i < supports.length; i++) {
					let support = supports[i],
						contactId = support.id(),
						contact: Contact = contacts.has(contactId) ? contacts.get(contactId)! : new Contact(support);

					contacts.set(contactId, contact);
					activeContacts.push(contact);
				}

				this.separation = collision.depth;
				this.setActive(true, timestamp);
			} else {
				if (this.isActive === true)
					this.setActive(false, timestamp);
			}
		}

		/**
		 * Set a pair as active or inactive.
		 * @method setActive
		 * @param {pair} pair
		 * @param {bool} isActive
		 * @param {number} timestamp
		 */
		public setActive(isActive: boolean, timestamp: number) {
			if (isActive) {
				this.isActive = true;
				this.timeUpdated = timestamp;
			} else {
				this.isActive = false;
				this.activeContacts.length = 0;
			}
		}

		/**
		 * Get the id for the given pair.
		 * @method id
		 * @param {body} bodyA
		 * @param {body} bodyB
		 * @return {string} Unique pairId
		 */
		public static getID(bodyA: Body, bodyB: Body)
		{
			if (bodyA.id < bodyB.id) {
				return 'A' + bodyA.id + 'B' + bodyB.id;
			} else {
				return 'A' + bodyB.id + 'B' + bodyA.id;
			}
		}
	}
}