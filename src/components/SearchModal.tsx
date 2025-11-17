import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Users, Hammer, Home } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface SearchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SearchModal = ({ open, onOpenChange }: SearchModalProps) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }

    const searchTimeout = setTimeout(async () => {
      setLoading(true);
      
      // Search across profiles
      const { data: profiles } = await supabase
        .from("profiles")
        .select("*")
        .or(`full_name.ilike.%${query}%,city.ilike.%${query}%,state.ilike.%${query}%`)
        .limit(10);

      // Search across land listings
      const { data: lands } = await supabase
        .from("land_listings")
        .select("*")
        .or(`title.ilike.%${query}%,location.ilike.%${query}%,description.ilike.%${query}%`)
        .limit(5);

      // Search across materials
      const { data: materials } = await supabase
        .from("material_listings")
        .select("*")
        .or(`material_name.ilike.%${query}%,category.ilike.%${query}%,city.ilike.%${query}%`)
        .limit(5);

      const combinedResults = [
        ...(profiles || []).map(p => ({ ...p, type: 'profile' })),
        ...(lands || []).map(l => ({ ...l, type: 'land' })),
        ...(materials || []).map(m => ({ ...m, type: 'material' }))
      ];

      setResults(combinedResults);
      setLoading(false);
    }, 300);

    return () => clearTimeout(searchTimeout);
  }, [query]);

  const getIcon = (type: string, userType?: string) => {
    if (type === 'land') return <Home className="h-4 w-4" />;
    if (type === 'material') return <Hammer className="h-4 w-4" />;
    return <Users className="h-4 w-4" />;
  };

  const handleResultClick = (result: any) => {
    if (result.type === 'profile') {
      const routeMap: Record<string, string> = {
        engineer: '/engineers',
        architect: '/architects',
        worker: '/civil-workers',
        contractor: '/contractors-builders',
        builder: '/contractors-builders',
      };
      navigate(routeMap[result.user_type] || '/services');
    } else if (result.type === 'land') {
      navigate('/land-records');
    } else if (result.type === 'material') {
      navigate('/material-sellers');
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Search CivilConnect</DialogTitle>
        </DialogHeader>
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search for professionals, land, materials..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10"
            autoFocus
          />
        </div>
        
        <div className="mt-4 max-h-96 overflow-y-auto space-y-2">
          {loading && (
            <div className="text-center text-sm text-muted-foreground py-8">
              Searching...
            </div>
          )}
          
          {!loading && query.length >= 2 && results.length === 0 && (
            <div className="text-center text-sm text-muted-foreground py-8">
              No results found
            </div>
          )}
          
          {!loading && results.map((result, idx) => (
            <div
              key={idx}
              onClick={() => handleResultClick(result)}
              className="p-3 hover:bg-accent rounded-lg cursor-pointer transition-colors animate-fade-in"
            >
              <div className="flex items-start gap-3">
                <div className="text-primary mt-1">
                  {getIcon(result.type, result.user_type)}
                </div>
                <div className="flex-1">
                  <div className="font-medium">
                    {result.full_name || result.title || result.material_name}
                  </div>
                  <div className="text-sm text-muted-foreground flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {result.city || result.location}
                    {result.state && `, ${result.state}`}
                  </div>
                  {result.type === 'profile' && (
                    <div className="text-xs text-muted-foreground mt-1 capitalize">
                      {result.user_type}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
