import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Textarea } from '../components/ui/textarea'
import { Select, SelectItem, SelectTrigger, SelectValue, SelectContent } from '../components/ui/select'
import { Checkbox } from '../components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group'
import { Label } from '../components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import { Slider } from '../components/ui/slider'
import { Switch } from '../components/ui/switch'
import { Calendar } from '../components/ui/calendar'
import { Popover, PopoverTrigger, PopoverContent } from '../components/ui/popover'
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

export interface FormData {
  contentPreferences: {
    purpose: string;
    scriptDescription: string;
    additionalItems: string;
    inPostText: string;
    template: string;
    postTheme: string;
    tone: string;
    contentType: string;
    targetAudience: string;
    creativeStyle: string;
    personalization: string[];
    uploadedImages: string[];
    PostNotification: string;
  };
  campaignScheduling: {
    startDate: Date | null;
    endDate: Date | null;
    frequency: string;
    deliveryChannels: string[];
    bestTimeToDeliver: string;
    goals: string;
    platforms: string[];
  };
  customerData: {
    demographics: string[];
    behaviorDateRange: { start: Date | null; end: Date | null };
    interests: string[];
    preferredChannels: string[];
  };
  brandGuidelines: {
    logo: File | null;
    colors: string;
    tone: string;
    fonts: string;
    keyMessages: string;
  };
}

interface FormStepProps {
  step: number
  formData: FormData
  handleInputChange: (section: keyof FormData, field: string, value: any) => void
}

export function FormStep({ step, formData, handleInputChange }: FormStepProps) {
  switch (step) {
    case 1:
      return (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Content Creation</h2>
          <div className="space-y-2">
            <Label htmlFor="purpose">Purpose</Label>
            <Select onValueChange={(value) => handleInputChange('contentPreferences', 'purpose', value)}>
              <SelectTrigger className="w-full bg-background">
                <SelectValue placeholder="Select purpose" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="increaseBrandAwareness">Increase Brand Awareness</SelectItem>
                <SelectItem value="promoteProduct">Promote a Product</SelectItem>
                <SelectItem value="driveEngagement">Drive Engagement</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="scriptDescription">Script/Description</Label>
            <Textarea
              id="scriptDescription"
              placeholder="Enter the basic description or message to convey"
              onChange={(e) => handleInputChange('contentPreferences', 'scriptDescription', e.target.value)}
            />
          </div>
          {/* <div className="space-y-2">
            <Label htmlFor="characters">Characters</Label>
            <Input
              id="characters"
              type="text"
              placeholder="Enter characters (e.g., brand ambassador, product mascots)"
              onChange={(e) => handleInputChange('contentPreferences', 'characters', e.target.value)}
            />
          </div> */}
          {/* <div className="space-y-2">
            <Label htmlFor="styleDetails">Angles, Style, Camera Details</Label>
            <Input
              id="styleDetails"
              type="text"
              placeholder="Specify angles, styles, and camera-related preferences"
              onChange={(e) => handleInputChange('contentPreferences', 'styleDetails', e.target.value)}
            />
          </div> */}
          {/* <div className="space-y-2">
            <Label htmlFor="backgroundInfo">Background Information</Label>
            <Input
              id="backgroundInfo"
              type="text"
              placeholder="Provide context or background setting"
              onChange={(e) => handleInputChange('contentPreferences', 'backgroundInfo', e.target.value)}
            />
          </div> */}
          <div className="space-y-2">
            <Label htmlFor="additionalItems">Additional Items</Label>
            <Input
              id="additionalItems"
              type="text"
              placeholder="Specify any objects to be included"
              onChange={(e) => handleInputChange('contentPreferences', 'additionalItems', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="inPostText">In-Post Text</Label>
            <Input
              id="inPostText"
              type="text"
              placeholder="What should the text on the image say?"
              onChange={(e) => handleInputChange('contentPreferences', 'inPostText', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="template">Template/Idea</Label>
            <Textarea
              id="template"
              placeholder="Provide a general template or creative direction"
              onChange={(e) => handleInputChange('contentPreferences', 'template', e.target.value)}
            />
          </div>
        </div>
      )
    case 2:
      return (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Content Style</h2>
          {/* <div className="space-y-2">
            <Label htmlFor="visualAesthetic">Visual Aesthetic</Label>
            <Input
              id="visualAesthetic"
              type="text"
              placeholder="Describe the desired aesthetic (e.g., bright, dark, dynamic)"
              onChange={(e) => handleInputChange('contentPreferences', 'visualAesthetic', e.target.value)}
            />
          </div> */}
          {/* <div className="space-y-2">
            <Label htmlFor="colorScheme">Color Scheme</Label>
            <Input
              id="colorScheme"
              type="text"
              placeholder="Specify the general color scheme (e.g., red, black, neutral)"
              onChange={(e) => handleInputChange('contentPreferences', 'colorScheme', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="typography">Typography</Label>
            <Input
              id="typography"
              type="text"
              placeholder="Font details (e.g., bold, minimalist, casual)"
              onChange={(e) => handleInputChange('contentPreferences', 'typography', e.target.value)}
            />
          </div> */}
          {/* <div className="space-y-2">
            <Label htmlFor="texturePatterns">Texture/Patterns</Label>
            <Input
              id="texturePatterns"
              type="text"
              placeholder="Specify patterns or textures to be used"
              onChange={(e) => handleInputChange('contentPreferences', 'texturePatterns', e.target.value)}
            />
          </div> */}
          <div className="space-y-2">
            <Label htmlFor="postTheme">Post Theme</Label>
            <Select onValueChange={(value) => handleInputChange('contentPreferences', 'postTheme', value)}>
              <SelectTrigger className="w-full bg-background">
                <SelectValue placeholder="Select post theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="educational">Educational</SelectItem>
                <SelectItem value="productFocused">Product-Focused</SelectItem>
                <SelectItem value="behindTheScenes">Behind-the-Scenes</SelectItem>
                <SelectItem value="engagement">Engagement</SelectItem>
                <SelectItem value="trending">Trending</SelectItem>
                <SelectItem value="story">Story</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="tone">Tone</Label>
            <Select onValueChange={(value) => handleInputChange('contentPreferences', 'tone', value)}>
              <SelectTrigger className="w-full bg-background">
                <SelectValue placeholder="Select tone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="friendly">Friendly</SelectItem>
                <SelectItem value="formal">Formal</SelectItem>
                <SelectItem value="playful">Playful</SelectItem>
                <SelectItem value="interactive">Interactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )
    case 3:
      return (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">SM Strategy</h2>
          <div className="space-y-2">
            <Label>Goals and Objectives</Label>
            <Select onValueChange={(value) => handleInputChange('campaignScheduling', 'goals', value)}>
              <SelectTrigger className="w-full bg-background">
                <SelectValue placeholder="Select goals and objectives" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="increaseBrandAwareness">Increasing Brand Awareness</SelectItem>
                <SelectItem value="driveTraffic">Driving Traffic</SelectItem>
                <SelectItem value="promoteServices">Promoting Services</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {/* <div className="space-y-2">
            <Label>Platform Selection</Label>
            <div className="flex flex-wrap gap-2">
              {['Facebook', 'Instagram', 'Twitter', 'LinkedIn', 'TikTok'].map((platform) => (
                <div key={platform} className="flex items-center space-x-2">
                  <Checkbox
                    id={platform}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        handleInputChange('campaignScheduling', 'platforms', [...(formData.campaignScheduling.platforms || []), platform])
                      } else {
                        handleInputChange('campaignScheduling', 'platforms', (formData.campaignScheduling.platforms || []).filter((p: string) => p !== platform))
                      }
                    }}
                  />
                  <Label htmlFor={platform}>{platform}</Label>
                </div>
              ))}
            </div>
          </div> */}
          <div className="space-y-2">
            <Label htmlFor="uploadImage">Upload Images</Label>
            <Input
                id="uploadImage"
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => {
                  const files = Array.from(e.target.files || []);
                  
                  // Function to convert file to Base64
                  const convertToBase64 = (file:any) => {
                    return new Promise((resolve, reject) => {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        resolve(reader.result);
                      };
                      reader.onerror = reject;
                      reader.readAsDataURL(file); // Converts file to base64 string
                    });
                  };

                  // Convert all files to base64 format
                  Promise.all(files.map(file => convertToBase64(file)))
                    .then(base64Images => {
                      handleInputChange('contentPreferences', 'uploadedImages', base64Images); // Update the state with base64 strings
                    })
                    .catch(error => {
                      console.error("Error converting files to Base64", error);
                    });
                }}
              />

          </div>
        </div>
      )
      case 4:
        return (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Customer Data Collection</h2>
            <div className="space-y-2">
              <Label>Customer Demographics</Label>
              <Select
                onValueChange={(value) => handleInputChange('customerData', 'demographics', [...(formData.customerData.demographics || []), value])}
              >
                <SelectTrigger className="w-full bg-background">
                  <SelectValue placeholder="Select demographics" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="age18-24">Age 18-24</SelectItem>
                  <SelectItem value="age25-34">Age 25-34</SelectItem>
                  <SelectItem value="age35-44">Age 35-44</SelectItem>
                  <SelectItem value="age45+">Age 45+</SelectItem>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {/* <div className="space-y-2">
              <Label>Behavioral Data Date Range</Label>
              <div className="flex space-x-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline">
                      {formData.customerData.behaviorDateRange?.start ? (
                        format(formData.customerData.behaviorDateRange.start, "PPP")
                      ) : (
                        <span>Pick a start date</span>
                      )}
                      <CalendarIcon className="ml-2 h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.customerData.behaviorDateRange?.start || undefined}
                      onSelect={(date) => handleInputChange('customerData', 'behaviorDateRange', { ...formData.customerData.behaviorDateRange, start: date })}
                    />
                  </PopoverContent>
                </Popover>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline">
                      {formData.customerData.behaviorDateRange?.end ? (
                        format(formData.customerData.behaviorDateRange.end, "PPP")
                      ) : (
                        <span>Pick an end date</span>
                      )}
                      <CalendarIcon className="ml-2 h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.customerData.behaviorDateRange?.end || undefined}
                      onSelect={(date) => handleInputChange('customerData', 'behaviorDateRange', { ...formData.customerData.behaviorDateRange, end: date })}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div> */}
            <div className="space-y-2">
              <Label>Interests/Preferences</Label>
              <div className="flex flex-wrap gap-2">
                {['Technology', 'Fashion', 'Sports', 'Food', 'Travel'].map((interest) => (
                  <div key={interest} className="flex items-center space-x-2">
                    <Checkbox
                      id={interest}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          handleInputChange('customerData', 'interests', [...(formData.customerData.interests || []), interest])
                        } else {
                          handleInputChange('customerData', 'interests', (formData.customerData.interests || []).filter((i: string) => i !== interest))
                        }
                      }}
                    />
                    <Label htmlFor={interest}>{interest}</Label>
                  </div>
                ))}
              </div>
            </div>
            {/* <div className="space-y-2">
              <Label htmlFor="engagementData">Engagement Data</Label>
              <Textarea
                id="engagementData"
                placeholder="Enter previous campaign engagement data"
                value={formData.customerData.engagementData || ''}
                onChange={(e) => handleInputChange('customerData', 'engagementData', e.target.value)}
              />
            </div> */}
            <div className="space-y-2">
              <Label>Preferred Channels</Label>
              <div className="flex flex-wrap gap-2">
                {['Email', 'SMS', 'Social Media', 'App Notifications'].map((channel) => (
                  <div key={channel} className="flex items-center space-x-2">
                    <Checkbox
                      id={channel}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          handleInputChange('customerData', 'preferredChannels', [...(formData.customerData.preferredChannels || []), channel])
                        } else {
                          handleInputChange('customerData', 'preferredChannels', (formData.customerData.preferredChannels || []).filter((c: string) => c !== channel))
                        }
                      }}
                    />
                    <Label htmlFor={channel}>{channel}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )
        case 5:
          return (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Brand Guidelines</h2>
                <div className="space-y-2">
                  <Label htmlFor="logo">Logo Upload</Label>
                  <Input
                  id="logo"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    handleInputChange('brandGuidelines', 'logo', file);
                  }}
                />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="colors">Brand Colors</Label>
                  <Input
                    id="colors"
                    type="text"
                    placeholder="Enter brand colors (e.g., #FFFFFF, #000000)"
                    onChange={(e) => handleInputChange('brandGuidelines', 'colors', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tone">Brand Tone</Label>
                  <Select onValueChange={(value) => handleInputChange('brandGuidelines', 'tone', value)}>
                    <SelectTrigger className="w-full bg-background">
                      <SelectValue placeholder="Select brand tone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="formal">Formal</SelectItem>
                      <SelectItem value="casual">Casual</SelectItem>
                      <SelectItem value="playful">Playful</SelectItem>
                      <SelectItem value="professional">Professional</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fonts">Brand Fonts</Label>
                  <Input
                    id="fonts"
                    type="text"
                    placeholder="Enter brand fonts or URL to style guide"
                    onChange={(e) => handleInputChange('brandGuidelines', 'fonts', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="keyMessages">Key Marketing Messages</Label>
                  <Textarea
                    id="keyMessages"
                    placeholder="Enter main slogans and messaging focus"
                    onChange={(e) => handleInputChange('brandGuidelines', 'keyMessages', e.target.value)}
                  />
                </div>
            </div>
          )
          case 6: 
          return (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Campaign Scheduling</h2>
                <div className="space-y-2">
                  <Label>Campaign Date Range</Label>
                  <div className="flex space-x-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline">
                          {formData.campaignScheduling.startDate ? (
                            format(formData.campaignScheduling.startDate, "PPP")
                          ) : (
                            <span>Pick a start date</span>
                          )}
                          <CalendarIcon className="ml-2 h-4 w-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={formData.campaignScheduling.startDate || undefined}
                          onSelect={(date) => handleInputChange('campaignScheduling', 'startDate', date)}
                        />
                      </PopoverContent>
                    </Popover>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline">
                          {formData.campaignScheduling.endDate ? (
                            format(formData.campaignScheduling.endDate, "PPP")
                          ) : (
                            <span>Pick an end date</span>
                          )}
                          <CalendarIcon className="ml-2 h-4 w-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={formData.campaignScheduling.endDate || undefined}
                          onSelect={(date) => handleInputChange('campaignScheduling', 'endDate', date)}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Campaign Frequency</Label>
                  <RadioGroup onValueChange={(value) => handleInputChange('campaignScheduling', 'frequency', value)}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="daily" id="daily" />
                      <Label htmlFor="daily">Daily</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="weekly" id="weekly" />
                      <Label htmlFor="weekly">Weekly</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="biweekly" id="biweekly" />
                      <Label htmlFor="biweekly">Bi-weekly</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="monthly" id="monthly" />
                      <Label htmlFor="monthly">Monthly</Label>
                    </div>
                  </RadioGroup>
                </div>
                <div className="space-y-2">
                  <Label>Preferred Delivery Channels</Label>
                  <div className="flex flex-wrap gap-2">
                    {['Email', 'Social Media', 'SMS'].map((channel) => (
                      <div key={channel} className="flex items-center space-x-2">
                        <Checkbox
                          id={channel}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              handleInputChange('campaignScheduling', 'deliveryChannels', [...formData.campaignScheduling.deliveryChannels, channel])
                            } else {
                              handleInputChange('campaignScheduling', 'deliveryChannels', formData.campaignScheduling.deliveryChannels.filter((c:string) => c !== channel))
                            }
                          }}
                        />
                        <Label htmlFor={channel}>{channel}</Label>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bestTimeToDeliver">Best Time to Deliver</Label>
                  <Input
                    id="bestTimeToDeliver"
                    type="time"
                    onChange={(e) => handleInputChange('campaignScheduling', 'bestTimeToDeliver', e.target.value)}
                  />
                </div>
            </div>
          )
          case 7:
            return(
              <div className="space-y-2">
              <Label htmlFor="additionalItems">Post Notification</Label>
              <Input
                id="additionalItems"
                type="text"
                placeholder="Specify any objects to be included"
                onChange={(e) => handleInputChange('contentPreferences', 'PostNotification', e.target.value)}
              />
            </div>
            )
            
    // ... (other cases remain the same)
    default:
      return null
  }
}