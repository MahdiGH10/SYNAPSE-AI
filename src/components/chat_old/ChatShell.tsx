"use client";

const ChatShell = () => {
  return (
    <section className="flex min-h-screen w-full items-center justify-center bg-workspace-base px-6 py-12 text-white">
      <div className="max-w-xl rounded-3xl border border-white/10 bg-[rgba(10,15,28,0.9)] p-10 text-center shadow-panel-soft backdrop-blur">
        <h1 className="text-2xl font-semibold text-white/90">Chat temporarily disabled</h1>
        <p className="mt-4 text-sm text-white/60">
          The previous SynapseAI chat workspace has been removed for now. We&apos;re keeping the route alive so the rest of
          the app keeps working, but no chat tools are loaded at the moment.
        </p>
      </div>
    </section>
  );
};

export default ChatShell;
