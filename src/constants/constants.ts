import { TreeNodeModel } from "../components/tree/tree-node";

export const DATA: TreeNodeModel[] = [
	{
		id: '1',
		label: 'Food',
		children: [
			{
				id: '2',
				label: 'Meat',
			},
			{
				id: '3',
				label: 'Salad',
				lazyLoad: true
			},
		],
	},
	{
		id: '6',
		label: 'Drinks',
		children: [
			{
				id: '7',
				label: 'Beer',
			},
			{
				id: '8',
				label: 'Soft drink',
			},
		],
	},
];

export const DATA_LAZY: TreeNodeModel[] = [
	{
		id: '4',
		label: 'Tomate',
	},
	{
		id: '5',
		label: 'Onion',
	}
];