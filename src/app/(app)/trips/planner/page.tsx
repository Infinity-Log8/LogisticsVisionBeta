'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ArrowLeft, Route, Map, Milestone, PlusCircle, Trash2, Navigation, Wand2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { planRouteAction } from './actions';
import type { RoutePlannerOutput } from '@/ai/flows/route-planner-flow';
import { mockLocations } from '@/data/locations';

const waypointSchema = z.string().min(1, 'Waypoint cannot be empty.');

const formSchema = z.object({
  origin: z.string().min(1, 'Origin is required.'),
  destination: z.string().min(1, 'Destination is required.'),
  waypoints: z.array(waypointSchema).optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function RoutePlannerPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RoutePlannerOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [waypoints, setWaypoints] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState<{ field: string; value: string } | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      origin: '',
      destination: '',
      waypoints: [],
    },
  });

  const filteredSuggestions = (value: string) =>
    value.length >= 1
      ? mockLocations.filter((loc) =>
          loc.label.toLowerCase().includes(value.toLowerCase())
        ).slice(0, 6)
      : [];

  async function onSubmit(data: FormValues) {
    setLoading(true);
    setResult(null);
    setError(null);

    const waypointStr = waypoints.filter(Boolean).length > 0 ? ` via ${waypoints.filter(Boolean).join(", ")}` : "";
    const actionResult = await planRouteAction({ origin: data.origin, destination: `${data.destination}${waypointStr}` });

    if ('error' in actionResult) {
      setError(actionResult.error);
    } else {
      setResult(actionResult);
    }

    setLoading(false);
  }

  const addWaypoint = () => setWaypoints((prev) => [...prev, '']);
  const removeWaypoint = (index: number) =>
    setWaypoints((prev) => prev.filter((_, i) => i !== index));
  const updateWaypoint = (index: number, value: string) =>
    setWaypoints((prev) => prev.map((w, i) => (i === index ? value : w)));

  return (
    <div className="flex-1 space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/trips">
          <Button variant="outline" size="icon"><ArrowLeft className="h-4 w-4" /></Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">AI Route Planner</h1>
          <p className="text-muted-foreground">Get an optimized route for your truck shipments.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Navigation className="h-5 w-5" />
              Plan a New Route
            </CardTitle>
            <CardDescription>Enter origin, destination and optional stops. Type any address or choose from suggestions.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                {/* Origin Field */}
                <FormField
                  control={form.control}
                  name="origin"
                  render={({ field }) => (
                    <FormItem className="relative">
                      <FormLabel className="flex items-center gap-1.5">
                        <span className="flex items-center justify-center h-5 w-5 rounded-full bg-green-500 text-white text-xs font-bold">A</span>
                        Origin / From
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter city, address or region..."
                          {...field}
                          autoComplete="off"
                          onFocus={() => setShowSuggestions({ field: 'origin', value: field.value })}
                          onChange={(e) => {
                            field.onChange(e);
                            setShowSuggestions({ field: 'origin', value: e.target.value });
                          }}
                          onBlur={() => setTimeout(() => setShowSuggestions(null), 150)}
                        />
                      </FormControl>
                      {showSuggestions?.field === 'origin' && filteredSuggestions(showSuggestions.value).length > 0 && (
                        <div className="absolute z-50 top-full left-0 right-0 mt-1 rounded-md border bg-popover shadow-md">
                          {filteredSuggestions(showSuggestions.value).map((loc) => (
                            <button
                              key={loc.value}
                              type="button"
                              className="w-full text-left px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground first:rounded-t-md last:rounded-b-md"
                              onMouseDown={() => {
                                form.setValue('origin', loc.label);
                                setShowSuggestions(null);
                              }}
                            >
                              {loc.label}
                            </button>
                          ))}
                        </div>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Destination Field */}
                <FormField
                  control={form.control}
                  name="destination"
                  render={({ field }) => (
                    <FormItem className="relative">
                      <FormLabel className="flex items-center gap-1.5">
                        <span className="flex items-center justify-center h-5 w-5 rounded-full bg-red-500 text-white text-xs font-bold">B</span>
                        Destination / To
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter city, address or region..."
                          {...field}
                          autoComplete="off"
                          onFocus={() => setShowSuggestions({ field: 'destination', value: field.value })}
                          onChange={(e) => {
                            field.onChange(e);
                            setShowSuggestions({ field: 'destination', value: e.target.value });
                          }}
                          onBlur={() => setTimeout(() => setShowSuggestions(null), 150)}
                        />
                      </FormControl>
                      {showSuggestions?.field === 'destination' && filteredSuggestions(showSuggestions.value).length > 0 && (
                        <div className="absolute z-50 top-full left-0 right-0 mt-1 rounded-md border bg-popover shadow-md">
                          {filteredSuggestions(showSuggestions.value).map((loc) => (
                            <button
                              key={loc.value}
                              type="button"
                              className="w-full text-left px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground first:rounded-t-md last:rounded-b-md"
                              onMouseDown={() => {
                                form.setValue('destination', loc.label);
                                setShowSuggestions(null);
                              }}
                            >
                              {loc.label}
                            </button>
                          ))}
                        </div>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Waypoints */}
                {waypoints.length > 0 && (
                  <div className="space-y-3">
                    <FormLabel className="flex items-center gap-1.5">
                      <Milestone className="h-4 w-4 text-muted-foreground" />
                      Stops Along the Way
                    </FormLabel>
                    {waypoints.map((wp, index) => (
                      <div key={index} className="relative flex gap-2">
                        <div className="relative flex-1">
                          <Input
                            placeholder={`Stop ${index + 1} - Enter city or address...`}
                            value={wp}
                            autoComplete="off"
                            onChange={(e) => {
                              updateWaypoint(index, e.target.value);
                              setShowSuggestions({ field: `wp-${index}`, value: e.target.value });
                            }}
                            onFocus={() => setShowSuggestions({ field: `wp-${index}`, value: wp })}
                            onBlur={() => setTimeout(() => setShowSuggestions(null), 150)}
                          />
                          {showSuggestions?.field === `wp-${index}` && filteredSuggestions(showSuggestions.value).length > 0 && (
                            <div className="absolute z-50 top-full left-0 right-0 mt-1 rounded-md border bg-popover shadow-md">
                              {filteredSuggestions(showSuggestions.value).map((loc) => (
                                <button
                                  key={loc.value}
                                  type="button"
                                  className="w-full text-left px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground first:rounded-t-md last:rounded-b-md"
                                  onMouseDown={() => {
                                    updateWaypoint(index, loc.label);
                                    setShowSuggestions(null);
                                  }}
                                >
                                  {loc.label}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeWaypoint(index)}
                          className="text-muted-foreground hover:text-destructive shrink-0"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                <Button type="button" variant="outline" size="sm" className="gap-2 w-full" onClick={addWaypoint}>
                  <PlusCircle className="h-4 w-4" />
                  Add Stop / Waypoint
                </Button>

                <Button type="submit" className="w-full gap-2" disabled={loading}>
                  <Wand2 className="h-4 w-4" />
                  {loading ? 'Planning Route...' : 'Plan Optimized Route'}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Map className="h-5 w-5" />
              Optimized Route Plan
            </CardTitle>
            <CardDescription>The AI-suggested route and estimated stats will appear here.</CardDescription>
          </CardHeader>
          <CardContent className="min-h-[300px]">
            {loading && (
              <div className="flex items-center justify-center h-full">
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <Route className="h-10 w-10 animate-pulse text-primary" />
                  <p>Calculating best route...</p>
                </div>
              </div>
            )}
            {error && !loading && (
              <Alert variant="destructive">
                <AlertTitle>Planning Failed</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {result && !loading && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="p-2 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">Total Distance</p>
                    <p className="text-xl font-bold">{result.totalDistance.toLocaleString()} km</p>
                  </div>
                  <div className="p-2 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">Est. Time</p>
                    <p className="text-xl font-bold">{result.estimatedTime}</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2"><Map className="h-4 w-4" />Route Summary</h4>
                  <p className="text-sm text-muted-foreground">{result.summary}</p>
                </div>
                <Separator />
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2"><Milestone className="h-4 w-4" />Waypoints</h4>
                  <ol className="list-decimal list-inside space-y-2 text-sm">
                    {result.waypoints.map((waypoint, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <span className="flex items-center justify-center h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs font-bold">{index + 1}</span>
                        <span>{waypoint}</span>
                      </li>
                    ))}
                  </ol>
                </div>
                <Button asChild className="w-full mt-4">
                  <Link href={`/trips/new?origin=${encodeURIComponent(form.getValues('origin'))}&destination=${encodeURIComponent(form.getValues('destination'))}&distance=${result.totalDistance}`}>Create Trip from this Route</Link>
                </Button>
              </div>
            )}
            {!result && !error && !loading && (
              <div className="flex items-center justify-center h-full">
                <div className="text-center text-muted-foreground space-y-2">
                  <Route className="h-12 w-12 mx-auto text-muted-foreground/30" />
                  <p className="font-medium">Ready to plan</p>
                  <p className="text-sm">Fill in the origin and destination, then click Plan Route.</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
