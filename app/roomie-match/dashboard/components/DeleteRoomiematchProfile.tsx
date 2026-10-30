import React from 'react'
import { Button } from "../../../components/button/Button";

function DeleteRoomiematchProfile({setShowDeleteConfirm, handleDeleteProfile}: {setShowDeleteConfirm: (val: boolean) => void, handleDeleteProfile: () => void}) {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={() => setShowDeleteConfirm(false)}>
      <div
        className="bg-white rounded-xl p-6 max-w-md w-full"
        onClick={(e) => e.stopPropagation()}>
        <div className="text-center mb-6">
          <div className="text-6xl mb-4">⚠️</div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Delete Profile?
          </h3>
          <p className="text-gray-600">
            Are you sure you want to delete your RoomieMatch profile? This
            action cannot be undone.
          </p>
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            size="md"
            onClick={() => setShowDeleteConfirm(false)}
            className="flex-1">
            Cancel
          </Button>
          <Button
            variant="destructive"
            size="md"
            onClick={handleDeleteProfile}
            className="flex-1">
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}

export default DeleteRoomiematchProfile
