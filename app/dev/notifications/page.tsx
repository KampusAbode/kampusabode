"use client";

import { Button } from "../../components/button/Button";
import InlineBanner from "../../components/notifications/InlineBanner";
import {
  confirm,
  notificationHelpers,
  notify,
} from "../../lib/notifications/notify";

export default function NotificationsDemoPage() {
  const showConfirm = async (destructive = false) => {
    const accepted = await confirm({
      title: destructive ? "Delete this item?" : "Continue?",
      description: "This demonstrates the shared responsive confirmation dialog.",
      destructive,
      confirmLabel: destructive ? "Delete" : "Continue",
    });
    notify.info(accepted ? "Dialog confirmed." : "Dialog dismissed.");
  };

  return (
    <section className="container ka-notifications-demo">
      <h1>Notifications demo</h1>
      <p>Preview the shared toast, dialog, and inline banner patterns.</p>
      <div className="ka-notifications-demo__actions">
        <Button onClick={() => notify.success("Your changes have been saved.")}>
          Success
        </Button>
        <Button
          variant="destructive"
          onClick={() =>
            notify.error("We couldn’t complete that request.", {
              action: {
                label: "Retry",
                onClick: () => notify.info("Retry requested."),
              },
            })
          }
        >
          Error with action
        </Button>
        <Button
          variant="secondary"
          onClick={() => notify.warning("Your session will expire soon.")}
        >
          Warning
        </Button>
        <Button
          variant="outline"
          onClick={() => notify.info("Here’s an informational update.")}
        >
          Info
        </Button>
        <Button
          variant="outline"
          onClick={() => notify.loading("Working…", { id: "demo-loading" })}
        >
          Loading
        </Button>
        <Button
          variant="ghost"
          onClick={() => notify.dismiss("demo-loading")}
        >
          Dismiss loading
        </Button>
        <Button variant="outline" onClick={() => void showConfirm()}>
          Open dialog
        </Button>
        <Button
          variant="destructive"
          onClick={() => void showConfirm(true)}
        >
          Open destructive dialog
        </Button>
        <Button
          variant="secondary"
          onClick={() => void notificationHelpers.unsavedChanges()}
        >
          Unsaved changes helper
        </Button>
        <Button
          variant="outline"
          onClick={() => notificationHelpers.formSuccess()}
        >
          Form success helper
        </Button>
        <Button
          variant="outline"
          onClick={() => notificationHelpers.networkError()}
        >
          Network error helper
        </Button>
        <Button
          variant="outline"
          onClick={() => notificationHelpers.sessionExpired()}
        >
          Session expired helper
        </Button>
        <Button
          variant="outline"
          onClick={() => notificationHelpers.permissionDenied()}
        >
          Permission denied helper
        </Button>
      </div>
      <div className="ka-notifications-demo__banners">
        <InlineBanner variant="success" dismissible>
          Your profile has been updated.
        </InlineBanner>
        <InlineBanner variant="error" dismissible>
          We couldn’t load your content. Please try again.
        </InlineBanner>
        <InlineBanner variant="warning" dismissible>
          You’re offline. Changes may not be saved.
        </InlineBanner>
        <InlineBanner variant="info" dismissible>
          New listings are available in your area.
        </InlineBanner>
      </div>
    </section>
  );
}
