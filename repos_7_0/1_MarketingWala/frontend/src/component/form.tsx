import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store'; // Assuming RootState is defined in store.ts
import { updateFormData } from '../store/formslice'; // Redux action to update form data
import { motion } from 'framer-motion';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { FormData, FormStep } from './formdata'; // Assuming FormData and FormStep are defined elsewhere

interface MarketingCampaignInputFormProps {
  steps: number[];
  onClose: () => void; // Function to close the form
  onCampaignDataSubmit: (data: any) => void; // Function to pass campaign data to parent component
}

export default function MarketingCampaignInputForm({ steps, onClose, onCampaignDataSubmit }: MarketingCampaignInputFormProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const formData = useSelector((state: RootState) => state.form); // Get form data from Redux store
  const dispatch = useDispatch();

  const handleInputChange = (section: keyof FormData, field: string, value: any) => {
    const updatedData = {
      [section]: { ...formData[section], [field]: value }
    };
    dispatch(updateFormData(updatedData)); // Dispatch updated data to Redux
  };

  const handleNext = () => setCurrentStepIndex(prev => Math.min(prev + 1, steps.length - 1));
  const handlePrev = () => setCurrentStepIndex(prev => Math.max(prev - 1, 0));

  const handleSubmit = () => {
    onCampaignDataSubmit(formData); // Pass the form data to the parent component
    console.log(formData);
    onClose(); // Close the form after submission
  };

  return (
    <Card className="w-full max-w-7xl mx-auto p-8"> {/* Increased max width */}
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Marketing Campaign Input Form</CardTitle>
      </CardHeader>
      <CardContent className="max-h-[600px] overflow-auto no-scrollbar"> {/* Hide scrollbar */}
        <div className="mb-8 relative">
          <div className="h-2 bg-muted rounded-full">
            <motion.div
              className="h-full bg-primary rounded-full"
              initial={{ width: '0%' }}
              animate={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Current form step */}
        <motion.div
          key={currentStepIndex}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.3 }}
        >
          <FormStep step={steps[currentStepIndex]} formData={formData} handleInputChange={handleInputChange} />
        </motion.div>

        {/* Navigation buttons */}
        <div className="mt-6 flex justify-between">
          {currentStepIndex > 0 && (
            <Button onClick={handlePrev} variant="outline">
              Previous
            </Button>
          )}
          {currentStepIndex < steps.length - 1 ? (
            <Button onClick={handleNext} className="ml-auto">
              Next
            </Button>
          ) : (
            <Button onClick={handleSubmit} className="ml-auto">
              Submit
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
