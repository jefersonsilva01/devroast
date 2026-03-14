import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CodeEditor } from "@/components/ui/code-editor";
import { ScoreRing } from "@/components/ui/score-ring";
import { Toggle } from "@/components/ui/toggle";

export default function ComponentsPage() {
	return (
		<div className="min-h-screen bg-bg-page p-8">
			<div className="mx-auto max-w-4xl space-y-12">
				<header>
					<h1 className="text-3xl font-bold text-text-primary">
						UI Components
					</h1>
					<p className="mt-2 text-text-secondary">
						Visualização de todos os componentes de UI
					</p>
				</header>

				<section>
					<h2 className="mb-4 text-xl font-semibold text-text-primary">
						Button
					</h2>
					<div className="space-y-6 rounded-lg border border-border-primary bg-bg-surface p-6">
						<div>
							<h3 className="mb-3 text-sm font-medium text-text-tertiary">
								Variant
							</h3>
							<div className="flex flex-wrap gap-3">
								<Button variant="primary">Primary</Button>
								<Button variant="secondary">Secondary</Button>
								<Button variant="outline">Outline</Button>
								<Button variant="ghost">Ghost</Button>
								<Button variant="destructive">Destructive</Button>
							</div>
						</div>

						<div>
							<h3 className="mb-3 text-sm font-medium text-text-tertiary">
								Size
							</h3>
							<div className="flex flex-wrap items-center gap-3">
								<Button size="sm">Small</Button>
								<Button size="default">Default</Button>
								<Button size="lg">Large</Button>
								<Button size="icon" aria-label="Icon button" />
							</div>
						</div>

						<div>
							<h3 className="mb-3 text-sm font-medium text-text-tertiary">
								States
							</h3>
							<div className="flex flex-wrap gap-3">
								<Button>Default</Button>
								<Button disabled>Disabled</Button>
							</div>
						</div>
					</div>
				</section>

				<section>
					<h2 className="mb-4 text-xl font-semibold text-text-primary">
						Badge
					</h2>
					<div className="space-y-6 rounded-lg border border-border-primary bg-bg-surface p-6">
						<div>
							<h3 className="mb-3 text-sm font-medium text-text-tertiary">
								Variant
							</h3>
							<div className="flex flex-wrap gap-3">
								<Badge variant="default">Default</Badge>
								<Badge variant="secondary">Secondary</Badge>
								<Badge variant="success">Success</Badge>
								<Badge variant="warning">Warning</Badge>
								<Badge variant="error">Error</Badge>
								<Badge variant="outline">Outline</Badge>
							</div>
						</div>

						<div>
							<h3 className="mb-3 text-sm font-medium text-text-tertiary">
								Size
							</h3>
							<div className="flex flex-wrap items-center gap-3">
								<Badge size="sm">Small</Badge>
								<Badge size="default">Default</Badge>
								<Badge size="lg">Large</Badge>
							</div>
						</div>
					</div>
				</section>

				<section>
					<h2 className="mb-4 text-xl font-semibold text-text-primary">
						Toggle
					</h2>
					<div className="space-y-6 rounded-lg border border-border-primary bg-bg-surface p-6">
						<div>
							<h3 className="mb-3 text-sm font-medium text-text-tertiary">
								States
							</h3>
							<div className="flex flex-wrap gap-3">
								<Toggle aria-label="Toggle off">Off</Toggle>
								<Toggle pressed aria-label="Toggle on">
									On
								</Toggle>
								<Toggle disabled aria-label="Toggle disabled">
									Disabled
								</Toggle>
							</div>
						</div>
					</div>
				</section>

				<section>
					<h2 className="mb-4 text-xl font-semibold text-text-primary">
						ScoreRing
					</h2>
					<div className="rounded-lg border border-border-primary bg-bg-surface p-6">
						<div className="flex flex-wrap gap-8">
							<div className="flex flex-col items-center gap-2">
								<ScoreRing score={2.5} />
								<span className="text-sm text-text-tertiary">Low (2.5)</span>
							</div>
							<div className="flex flex-col items-center gap-2">
								<ScoreRing score={5.0} />
								<span className="text-sm text-text-tertiary">Medium (5.0)</span>
							</div>
							<div className="flex flex-col items-center gap-2">
								<ScoreRing score={8.5} />
								<span className="text-sm text-text-tertiary">High (8.5)</span>
							</div>
						</div>
					</div>
				</section>

				<section>
					<h2 className="mb-4 text-xl font-semibold text-text-primary">
						CodeEditor
					</h2>
					<div className="rounded-lg border border-border-primary bg-bg-surface p-6">
						<CodeEditor
							value={`function hello() {
  console.log("Hello, World!");
}`}
							placeholder="Paste your code here..."
						/>
					</div>
				</section>
			</div>
		</div>
	);
}
