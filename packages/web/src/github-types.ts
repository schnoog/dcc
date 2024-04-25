export namespace Github {
	export type Milestone = {
		title: string;
		id: number;
		url: string;
		html_url: string;
		labels_url: string;
		node_id: string;
		number: number;
		description: string;
		open_issues: number;
		closed_issues: number;
		state: string;
		created_at: string;
		updated_at: string;
		due_on: string;
		closed_at: string | null;
	};

	export type Reactions = {
		url: string;
		total_count: number;
		"+1": number;
		"-1": number;
		laugh: number;
		hooray: number;
		confused: number;
		heart: number;
		rocket: number;
		eyes: number;
	};

	export type Issue = {
		title: string;
		milestone?: Milestone;
		state: string;
		url: string;
		repository_url: string;
		labels_url: string;
		comments_url: string;
		html_url: string;
		id: number;
		node_id: string;
		number: number;
		labels: any[];
		comments: number;
		created_at: string;
		updated_at: string;
		closed_at: string | null;
		body: string;
		reactions: Reactions;
		timeline_url: string;
		performed_via_github_app: null;
		state_reason: null;
	};
}
