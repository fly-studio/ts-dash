namespace sharp {
	export class Contact {
		public id: string;
		public vertex: Vertex;
		public normalImpulse: number = 0;
		public tangentImpulse: number = 0;

		/**
		 * Creates a new contact.
		 * @method create
		 * @param {vertex} vertex
		 * @return {contact} A new contact
		 */
		constructor(vertex: Vertex)
		{
			this.id = Contact.getID(vertex);
			this.vertex = vertex;
		}

		/**
		 * Generates a contact id.
		 * @method id
		 * @param {vertex} vertex
		 * @return {string} Unique contactID
		 */
		public static getID(vertex: Vertex)
		{
			return vertex.body.id + '_' + vertex.index;
		}
	}
}