import { createRootRoute, HeadContent, Outlet } from "@tanstack/react-router";

export const Route = createRootRoute({
	component: RootComponent,
	// notFoundComponent: () => <NotFound />,
});

function RootComponent() {
	return (
		<>
			<HeadContent />
			<Outlet />
		</>
	);
}
