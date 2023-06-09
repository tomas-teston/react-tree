import { TreeNode } from '../App';

export const DATA: TreeNode[] = [
	{
		id: 1,
		name: "test-1",
		downloaded: false,
		children: []
	},
	{
		id: 1000,
		name: "test-1000 (with downloaded childrens)",
		downloaded: true,
		children: [{
			id: 1001,
			name: "test-1001",
			downloaded: false,
			children: []
		}]
	},
	{
		id: 1002,
		name: "test-1002 (with downloaded childrens and isOpenDefault)",
		downloaded: true,
		isOpenDefault: true,
		children: [{
			id: 1003,
			name: "test-1003",
			downloaded: false,
			children: []
		}]
	}
];